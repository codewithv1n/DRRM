import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import JavaScriptObfuscator from 'javascript-obfuscator'

// Plugin para i-handle ang .geojson files bilang JSON modules
function geojsonPlugin() {
  return {
    name: 'vite-plugin-geojson',
    transform(_code: string, id: string) {
      if (id.endsWith('.geojson')) {
        const json = fs.readFileSync(id, 'utf-8')
        return {
          code: `export default ${json}`,
          map: null,
        }
      }
    },
  }
}

// Custom plugin para i-obfuscate ang files on-the-fly sa DEV mode
function devObfuscatorPlugin() {
  return {
    name: 'dev-obfuscator',
    enforce: 'post', // Run after React/TS transforms
    apply: 'serve', // Only run during `npm run dev`
    transform(code: string, id: string) {
      // Obfuscate lang ang sarili nating code, wag ang node_modules
      if (id.includes('/src/') && (id.endsWith('.ts') || id.endsWith('.tsx') || id.endsWith('.js') || id.endsWith('.jsx'))) {
        try {
          const obfuscated = JavaScriptObfuscator.obfuscate(code, {
            compact: true,
            controlFlowFlattening: false,
            deadCodeInjection: false,
            debugProtection: false,
            disableConsoleOutput: false, // Wag muna i-disable console sa dev para maka-debug ka pa rin konti
            identifierNamesGenerator: 'hexadecimal',
            renameGlobals: false,
            rotateStringArray: true,
            selfDefending: false, // Disable self-defending sa dev para mabilis
            shuffleStringArray: true,
            splitStrings: false,
            stringArray: true,
            stringArrayEncoding: ['rc4'],
            transformObjectKeys: true,
            unicodeEscapeSequence: false
          });
          return {
            code: obfuscated.getObfuscatedCode(),
            map: null
          }
        } catch (e) {
          console.error('Error obfuscating: ', id);
          return null;
        }
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    geojsonPlugin(),
    devObfuscatorPlugin(),
  ],
  build: {
    sourcemap: false, // No source maps in production
    minify: 'terser', // Use Terser for better minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove all console.log in production
        drop_debugger: true,
      },
      mangle: {
        toplevel: true, // Mangle top-level variable names
      },
    },
  },
})
