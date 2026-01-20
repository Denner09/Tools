(function() {
    'use strict';

    // 1. Anti-Clickjacking (Frame Busting)
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }

    // 2. Disable Context Menu & Shortcuts
    document.addEventListener('contextmenu', e => e.preventDefault());

    document.onkeydown = function(e) {
        if (e.key === 'F12' || e.keyCode === 123) return false;
        if (e.ctrlKey && e.shiftKey && (['I','i','J','j','C','c','K','k'].includes(e.key) || [73,74,67,75].includes(e.keyCode))) return false;
        if (e.ctrlKey && (['U','u','S','s'].includes(e.key) || [85,83].includes(e.keyCode))) return false;
    };

    // 3. Console Warning & Clear
    const warningTitle = "🛑 PARADA OBRIGATÓRIA!";
    const warningMsg = "Esta é uma ferramenta de navegador segura.\nQualquer tentativa de engenharia reversa, injeção de script ou alteração de variáveis é monitorada.\nSe alguém pediu para você colar código aqui, é um GOLPE.";
    
    // Clear console aggressively
    setInterval(() => {
        if (window.console && console.clear) {
             // console.clear(); // Optional: keeps console clean but might annoy devs debugging valid issues. 
             // Let's stick to the warning but allow logs for errors.
        }
    }, 2000);

    if (window.console && console.log) {
        console.log(`%c${warningTitle}`, "color: red; font-size: 50px; font-weight: bold; text-shadow: 2px 2px black; background-color: yellow; padding: 10px; border-radius: 10px;");
        console.log(`%c${warningMsg}`, "font-size: 18px; color: #333; font-weight: bold;");
    }

    // 4. Advanced Debugger Trap (Anti-Analysis)
    // Dynamic debugger generation to avoid simple find-and-replace bypasses
    const checking = function(){
        const func = new Function('debugger');
        return function() { func(); };
    };
    setInterval(checking(), 500);

    // 5. DOM Integrity (Anti-Script Injection)
    // Blocks any NEW script tags from being added to the DOM after initial load protection kicks in.
    const scriptObserver = new MutationObserver((mutations) => {
        mutations.forEach(({ addedNodes }) => {
            addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
                    // Check if legitimate (e.g. from our allowed sources) or dynamic injection
                    // For maximum security, we remove ANY dynamic script injection.
                    node.parentNode.removeChild(node);
                    console.warn("Tentativa de injeção de script bloqueada.");
                    // Force reload/crash if malicious
                    // window.location.reload(); 
                }
            });
        });
    });

    // Start observing immediately
    scriptObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // 6. Object Freeze (Anti-Tamper)
    // Prevent modification of builtin prototypes
    try {
        Object.freeze(Object.prototype);
        Object.freeze(Array.prototype);
        Object.freeze(Function.prototype);
        // Do not freeze document or window completely as apps need them, but we can seal critical APIs if needed.
    } catch(e) {
        // Ignored
    }

})();
