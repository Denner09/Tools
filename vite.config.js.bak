import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // Silencing deprecation warnings from Bootstrap 5 with modern Sass
        silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function', 'mixed-decls']
      }
    }
  }
})
