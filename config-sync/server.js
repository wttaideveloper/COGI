const http = require('http')
const fs = require('fs')
const path = require('path')

const DATA_DIR = process.env.DATA_DIR || '/data'
const SEED_FILE = process.env.SEED_FILE || '/seed/site-config.json'
const STRAPI_INTERNAL_URL = (process.env.STRAPI_INTERNAL_URL || 'http://strapi:1337').replace(/\/+$/, '')
const MAX_BODY_BYTES = 10 * 1024 * 1024
const CONFIG_FILE = path.join(DATA_DIR, 'site-config.json')

function ensureConfig() {
  if (!fs.existsSync(SEED_FILE)) return
  const seedText = fs.readFileSync(SEED_FILE, 'utf8')
  const seed = JSON.parse(seedText)
  const current = fs.existsSync(CONFIG_FILE) ? JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8')) : null
  // Deploy newer repository content, while preserving subsequent admin publishes.
  if (current && (Date.parse(seed.updatedAt) || 0) <= (Date.parse(current.updatedAt) || 0)) return
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(CONFIG_FILE + '.tmp', seedText)
  fs.renameSync(CONFIG_FILE + '.tmp', CONFIG_FILE)
}

function send(res, status, body, contentType) {
  res.writeHead(status, {
    'Content-Type': contentType || 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-store',
  })
  res.end(body)
}

// Writes are limited to signed-in CMS users: the bearer token must be accepted by Strapi (users-permissions).
async function verifyWithStrapi(token) {
  try {
    const response = await fetch(STRAPI_INTERNAL_URL + '/api/users/me', { headers: { Authorization: 'Bearer ' + token } })
    return response.ok
  } catch {
    return false
  }
}

function createServer(verifyToken = verifyWithStrapi) {
  return http.createServer((req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname
  if (req.method === 'OPTIONS') return send(res, 204, '')

  if (req.method === 'GET' && (pathname === '/site-config.json' || pathname === '/__site-config')) {
    try {
      ensureConfig()
      if (!fs.existsSync(CONFIG_FILE)) return send(res, 404, JSON.stringify({ error: 'not found' }))
      return send(res, 200, fs.readFileSync(CONFIG_FILE, 'utf8'))
    } catch (err) {
      return send(res, 500, JSON.stringify({ error: String(err) }))
    }
  }

  if (req.method === 'POST' && pathname === '/__site-config') {
    const match = /^Bearer\s+(\S+)$/.exec(req.headers.authorization || '')
    if (!match) return send(res, 401, JSON.stringify({ error: 'authentication required' }))
    const chunks = []
    let size = 0
    let tooLarge = false
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > MAX_BODY_BYTES) { tooLarge = true; return }
      chunks.push(chunk)
    })
    req.on('end', async () => {
      if (tooLarge) return send(res, 413, JSON.stringify({ error: 'payload too large' }))
      if (!(await verifyToken(match[1]))) return send(res, 401, JSON.stringify({ error: 'invalid or expired token' }))
      try {
        const text = Buffer.concat(chunks).toString('utf8')
        const parsed = JSON.parse(text)
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('config must be a JSON object')
        fs.mkdirSync(DATA_DIR, { recursive: true })
        const tmp = CONFIG_FILE + '.tmp'
        fs.writeFileSync(tmp, text, 'utf8')
        fs.renameSync(tmp, CONFIG_FILE)
        return send(res, 200, JSON.stringify({ ok: true }))
      } catch (err) {
        return send(res, err instanceof SyntaxError || (err && err.message === 'config must be a JSON object') ? 400 : 500, JSON.stringify({ error: String(err) }))
      }
    })
    return
  }

  return send(res, 404, JSON.stringify({ error: 'not found' }))
  })
}

if (require.main === module) {
  createServer().listen(process.env.PORT || 3000, '0.0.0.0', () => {
    console.log('config-sync listening on port ' + (process.env.PORT || 3000))
  })
}

module.exports = { createServer }
