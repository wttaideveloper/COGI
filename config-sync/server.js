const http = require('http')
const fs = require('fs')
const path = require('path')

const DATA_DIR = process.env.DATA_DIR || '/data'
const SEED_FILE = process.env.SEED_FILE || '/seed/site-config.json'
const CONFIG_FILE = path.join(DATA_DIR, 'site-config.json')

function ensureConfig() {
  if (!fs.existsSync(CONFIG_FILE) && fs.existsSync(SEED_FILE)) {
    fs.writeFileSync(CONFIG_FILE, fs.readFileSync(SEED_FILE, 'utf8'))
  }
}

function send(res, status, body, contentType) {
  res.writeHead(status, {
    'Content-Type': contentType || 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store',
  })
  res.end(body)
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, '')

  if (req.method === 'GET' && (req.url === '/site-config.json' || req.url === '/__site-config')) {
    try {
      ensureConfig()
      if (!fs.existsSync(CONFIG_FILE)) return send(res, 404, JSON.stringify({ error: 'not found' }))
      return send(res, 200, fs.readFileSync(CONFIG_FILE, 'utf8'))
    } catch (err) {
      return send(res, 500, JSON.stringify({ error: String(err) }))
    }
  }

  if (req.method === 'POST' && req.url === '/__site-config') {
    let body = ''
    req.on('data', (chunk) => { body += chunk })
    req.on('end', () => {
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true })
        fs.writeFileSync(CONFIG_FILE, body, 'utf8')
        return send(res, 200, JSON.stringify({ ok: true }))
      } catch (err) {
        return send(res, 500, JSON.stringify({ error: String(err) }))
      }
    })
    return
  }

  return send(res, 404, JSON.stringify({ error: 'not found' }))
})

server.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log('config-sync listening on port ' + (process.env.PORT || 3000))
})