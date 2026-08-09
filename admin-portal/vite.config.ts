import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const CONFIG_PATH = path.resolve(rootDir, '../public-website/public/site-config.json')

function siteConfigSyncPlugin(): Plugin {
  return {
    name: 'cogi-site-config-sync',
    configureServer(server) {
      server.middlewares.use('/__site-config', (req, res, next) => {
        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
          res.end()
          return
        }

        if (req.method === 'GET') {
          try {
            const raw = fs.existsSync(CONFIG_PATH) ? fs.readFileSync(CONFIG_PATH, 'utf8') : '{}'
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.end(raw)
          } catch (error) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: String(error) }))
          }
          return
        }

        if (req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body || '{}')
              fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true })
              fs.writeFileSync(CONFIG_PATH, JSON.stringify(parsed, null, 2), 'utf8')
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.setHeader('Access-Control-Allow-Origin', '*')
              res.end(JSON.stringify({ ok: true }))
            } catch (error) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: String(error) }))
            }
          })
          return
        }

        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), siteConfigSyncPlugin()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(rootDir, './src'),
    },
  },
  server: {
    port: 5174,
  },
})
