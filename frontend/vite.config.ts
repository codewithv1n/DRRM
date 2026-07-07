import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'

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

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    geojsonPlugin(),
  ],
})
