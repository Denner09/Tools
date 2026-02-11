export const GlfxShaderLibrary = {
    // Standard Vertex Shader for all effects
    vertex: `
        attribute vec2 a_position;
        varying vec2 v_texCoord;
        void main() {
            gl_Position = vec4(a_position, 0.0, 1.0);
            v_texCoord = a_position * 0.5 + 0.5;
            v_texCoord.y = 1.0 - v_texCoord.y; // Flip Y for WebGL texture coords
        }
    `,

    // COLOR DOT SCREEN
    // Uniforms: u_texture, u_center, u_angle, u_scale, u_texSize
    dotScreen: `
        precision mediump float;
        uniform sampler2D u_texture;
        uniform vec2 u_center;
        uniform float u_angle;
        uniform float u_scale;
        uniform vec2 u_texSize;
        varying vec2 v_texCoord;

        float pattern() {
            float s = sin(u_angle), c = cos(u_angle);
            vec2 tex = v_texCoord * u_texSize - u_center * u_texSize;
            vec2 point = vec2(
                c * tex.x - s * tex.y,
                s * tex.x + c * tex.y
            ) * u_scale;
            return (sin(point.x) * sin(point.y)) * 4.0;
        }

        void main() {
            vec4 color = texture2D(u_texture, v_texCoord);
            float p = pattern();
            
            // Apply pattern to RGB channels to create colored dots
            // Modulate brightness by pattern
            vec3 final = color.rgb * 1.0 + vec3(p - 0.7); 
            // Adjust contrast of dots
            
            gl_FragColor = vec4(final, color.a);
        }
    `,

    // VIGNETTE
    // Uniforms: u_texture, u_size (0-1), u_amount (0-1)
    vignette: `
        precision mediump float;
        uniform sampler2D u_texture;
        uniform float u_size;
        uniform float u_amount;
        varying vec2 v_texCoord;
        void main() {
            vec4 color = texture2D(u_texture, v_texCoord);
            float dist = distance(v_texCoord, vec2(0.5, 0.5));
            color.rgb *= smoothstep(0.8, u_size * 0.799, dist * (u_amount + 0.5));
            gl_FragColor = color;
        }
    `,

    // ZOOM BLUR
    // Uniforms: u_texture, u_center (vec2), u_strength (0-1), u_texSize (vec2)
    zoomBlur: `
        precision mediump float;
        uniform sampler2D u_texture;
        uniform vec2 u_center;
        uniform float u_strength;
        uniform vec2 u_texSize;
        varying vec2 v_texCoord;
        
        float random(vec3 scale, float seed) {
            return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
        }
        
        void main() {
            vec4 color = vec4(0.0);
            float total = 0.0;
            vec2 toCenter = u_center - v_texCoord;
            float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);
            
            for (float t = 0.0; t <= 40.0; t++) {
                float percent = (t + offset) / 40.0;
                float weight = 4.0 * (percent - percent * percent);
                vec4 sample = texture2D(u_texture, v_texCoord + toCenter * percent * u_strength);
                sample.rgb *= sample.a;
                color += sample * weight;
                total += weight;
            }
            
            gl_FragColor = color / total;
            gl_FragColor.rgb /= gl_FragColor.a + 0.00001;
        }
    `,

    // INK
    // Uniforms: u_texture, u_strength (0-1), u_texSize
    ink: `
        precision mediump float;
        uniform sampler2D u_texture;
        uniform float u_strength;
        uniform vec2 u_texSize;
        varying vec2 v_texCoord;

        void main() {
            vec2 dx = vec2(1.0 / u_texSize.x, 0.0);
            vec2 dy = vec2(0.0, 1.0 / u_texSize.y);
            vec4 color = texture2D(u_texture, v_texCoord);
            float bigTotal = 0.0;
            float smallTotal = 0.0;
            vec3 bigAverage = vec3(0.0);
            vec3 smallAverage = vec3(0.0);
            
            for (float x = -2.0; x <= 2.0; x += 1.0) {
                for (float y = -2.0; y <= 2.0; y += 1.0) {
                    vec3 sample = texture2D(u_texture, v_texCoord + dx * x + dy * y).rgb;
                    bigAverage += sample;
                    bigTotal += 1.0;
                    if (abs(x) + abs(y) < 2.0) {
                        smallAverage += sample;
                        smallTotal += 1.0;
                    }
                }
            }
            
            vec3 edge = max(vec3(0.0), bigAverage / bigTotal - smallAverage / smallTotal);
            float edgeIntensity = dot(edge, vec3(0.2126, 0.7152, 0.0722)); // Luminance
            gl_FragColor = vec4(color.rgb - vec3(edgeIntensity * u_strength * 30.0), color.a);
        }
    `,
    
    // COLOR HALFTONE
    // Uniforms: u_texture, u_center, u_angle, u_scale, u_texSize
    colorHalftone: `
        precision mediump float;
        uniform sampler2D u_texture;
        uniform vec2 u_center;
        uniform float u_angle;
        uniform float u_scale;
        uniform vec2 u_texSize;
        varying vec2 v_texCoord;

        float pattern(float angle) {
            float s = sin(angle), c = cos(angle);
            vec2 tex = v_texCoord * u_texSize - u_center * u_texSize;
            vec2 point = vec2(
                c * tex.x - s * tex.y,
                s * tex.x + c * tex.y
            ) * u_scale;
            return (sin(point.x) * sin(point.y)) * 4.0;
        }

        void main() {
            vec4 color = texture2D(u_texture, v_texCoord);
            vec3 cmy = 1.0 - color.rgb;
            float k = min(cmy.x, min(cmy.y, cmy.z));
            cmy = (cmy - k) / (1.0 - k);
            
            // Standard CMYK angles: C: 15, M: 75, Y: 0, K: 45
            // But we can simplify or rotate based on u_angle
            cmy.x = clamp(cmy.x + pattern(u_angle + 0.26179) - 1.0, 0.0, 1.0); // Cyan 15deg
            cmy.y = clamp(cmy.y + pattern(u_angle + 1.30899) - 1.0, 0.0, 1.0); // Magenta 75deg
            cmy.z = clamp(cmy.z + pattern(u_angle) - 1.0, 0.0, 1.0);           // Yellow 0deg
            k = clamp(k + pattern(u_angle + 0.78539) - 1.0, 0.0, 1.0);         // Key 45deg
            
            gl_FragColor = vec4(1.0 - cmy - k, color.a);
        }
    `,

    // HEXAGONAL PIXELATE
    // Uniforms: u_texture, u_center, u_scale, u_texSize
    hexagonalPixelate: `
        precision mediump float;
        uniform sampler2D u_texture;
        uniform vec2 u_center;
        uniform float u_scale;
        uniform vec2 u_texSize;
        varying vec2 v_texCoord;

        void main() {
            vec2 tex = (v_texCoord * u_texSize - u_center * u_texSize) / u_scale;
            tex.y /= 0.866025404;
            tex.x -= tex.y * 0.5;
            
            vec2 a;
            if (tex.x + tex.y - floor(tex.x) - floor(tex.y) < 1.0) a = vec2(floor(tex.x), floor(tex.y));
            else a = vec2(ceil(tex.x), ceil(tex.y));
            vec2 b = vec2(ceil(tex.x), floor(tex.y));
            vec2 c = vec2(floor(tex.x), ceil(tex.y));
            
            vec3 TEX = vec3(tex.x, tex.y, 1.0 - tex.x - tex.y);
            vec3 A = vec3(a.x, a.y, 1.0 - a.x - a.y);
            vec3 B = vec3(b.x, b.y, 1.0 - b.x - b.y);
            vec3 C = vec3(c.x, c.y, 1.0 - c.x - c.y);
            
            vec3 alen = abs(TEX - A);
            vec3 blen = abs(TEX - B);
            vec3 clen = abs(TEX - C);
            
            vec2 choice;
            if (alen.x + alen.y + alen.z < blen.x + blen.y + blen.z)
                choice = a;
            else if (blen.x + blen.y + blen.z < clen.x + clen.y + clen.z)
                choice = b;
            else
                choice = c;
            
            choice.x += choice.y * 0.5;
            choice.y *= 0.866025404;
            choice *= u_scale / u_texSize;
            
            gl_FragColor = texture2D(u_texture, choice + u_center);
        }
    `,

    // BULGE / PINCH
    // Uniforms: u_texture, u_center, u_radius, u_strength
    bulgePinch: `
        precision mediump float;
        uniform sampler2D u_texture;
        uniform vec2 u_center;
        uniform float u_radius;
        uniform float u_strength;
        uniform vec2 u_texSize; // Aspect ratio correction
        varying vec2 v_texCoord;

        void main() {
            vec2 coord = v_texCoord;
            vec2 dist = coord - u_center;
            // Correct aspect ratio for circular bulge
            dist.x *= u_texSize.x / u_texSize.y;
            
            float r = length(dist);
            if (r < u_radius) {
                float amount = r / u_radius;
                float dist_val = pow(amount, u_strength) * r;
                
                // Original 'dist_src' logic
                // Strength > 1 = Pinch, Strength < 1 = Bulge?
                // glfx logic:
                // coord -= center
                // float percent = 1.0 - ((r / radius) clamp 0,1)
                // if percent > 0
                //   coord = coord * mix(1.0, smoothstep(0.0, radius / r, percent), strength * 0.75)
                //   coord +=center
                
                // Simplified:
                float percent = 1.0 - (r / u_radius);
                if (r > 0.0) {
                     // Using a standard pinching formula
                     // Strength -1 to 1?
                     // Let's use simple interpolation
                     vec2 dir = dist / r;
                     float newR = r * (1.0 - u_strength * percent * percent);
                     
                     // Un-correct aspect ratio
                     vec2 newDist = dir * newR;
                     newDist.x /= u_texSize.x / u_texSize.y;
                     coord = u_center + newDist;
                }
            }
            gl_FragColor = texture2D(u_texture, coord);
        }
    `,
    
    // SWIRL
    // Uniforms: u_texture, u_center, u_radius, u_angle
    swirl: `
        precision mediump float;
        uniform sampler2D u_texture;
        uniform vec2 u_center;
        uniform float u_radius;
        uniform float u_angle; // Swirl angle strength
        uniform vec2 u_texSize;
        varying vec2 v_texCoord;

        void main() {
            vec2 coord = v_texCoord;
            vec2 dist = coord - u_center;
            dist.x *= u_texSize.x / u_texSize.y;
            
            float r = length(dist);
            if (r < u_radius) {
                float percent = (u_radius - r) / u_radius;
                float theta = percent * percent * u_angle * 8.0;
                float s = sin(theta);
                float c = cos(theta);
                dist = vec2(
                    dot(dist, vec2(c, -s)),
                    dot(dist, vec2(s, c))
                );
            }
            
            dist.x /= u_texSize.x / u_texSize.y;
            coord = u_center + dist;
            gl_FragColor = texture2D(u_texture, coord);
        }
    `
};
