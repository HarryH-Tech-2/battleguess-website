import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import type { IncomingMessage, ServerResponse } from 'node:http'

/**
 * Minimal Vite dev middleware that serves files under `api/` as Vercel-style
 * serverless functions. Maps `/api/foo/bar` → `api/foo/bar.ts`, loads the
 * default export, parses JSON bodies, and exposes a request/response shape
 * compatible with @vercel/node handlers (status/json/send chaining).
 *
 * Exists because `vercel dev` does not run reliably when this project lives
 * inside a OneDrive-synced path — Node hits UNKNOWN read errors on the CLI's
 * own module graph. This middleware lets plain `vite` cover dev end-to-end.
 */
function apiHandlers(): Plugin {
  const apiRoot = path.resolve(__dirname, 'api')

  const resolveHandlerPath = (urlPath: string): string | null => {
    const rel = urlPath.replace(/^\/api\/?/, '').replace(/\/+$/, '')
    if (!rel) return null
    const candidates = [
      path.join(apiRoot, `${rel}.ts`),
      path.join(apiRoot, rel, 'index.ts'),
    ]
    for (const p of candidates) {
      if (fs.existsSync(p) && fs.statSync(p).isFile()) return p
    }
    return null
  }

  const readBody = (req: IncomingMessage): Promise<Buffer> =>
    new Promise((resolve, reject) => {
      const chunks: Buffer[] = []
      req.on('data', (c: Buffer) => chunks.push(c))
      req.on('end', () => resolve(Buffer.concat(chunks)))
      req.on('error', reject)
    })

  const wrapResponse = (res: ServerResponse) => {
    const r = res as ServerResponse & {
      status: (code: number) => typeof r
      json: (body: unknown) => typeof r
      send: (body: unknown) => typeof r
    }
    r.status = (code: number) => {
      res.statusCode = code
      return r
    }
    r.json = (body: unknown) => {
      if (!res.getHeader('Content-Type')) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
      }
      res.end(JSON.stringify(body))
      return r
    }
    r.send = (body: unknown) => {
      if (body === undefined || body === null) {
        res.end()
      } else if (typeof body === 'string' || Buffer.isBuffer(body)) {
        res.end(body)
      } else {
        if (!res.getHeader('Content-Type')) {
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
        }
        res.end(JSON.stringify(body))
      }
      return r
    }
    return r
  }

  return {
    name: 'battleguess-api-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) return next()

        // CORS — match vercel.json so the behaviour is the same as production.
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        if (req.method === 'OPTIONS') {
          res.statusCode = 200
          return res.end()
        }

        const url = new URL(req.url, 'http://localhost')
        const handlerFile = resolveHandlerPath(url.pathname)
        if (!handlerFile) {
          res.statusCode = 404
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          return res.end(JSON.stringify({ error: `No handler for ${url.pathname}` }))
        }

        try {
          const mod = await server.ssrLoadModule(pathToFileURL(handlerFile).href)
          const handler = (mod.default ?? mod.handler) as
            | ((req: IncomingMessage, res: ServerResponse) => unknown)
            | undefined
          if (typeof handler !== 'function') {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            return res.end(
              JSON.stringify({ error: `Handler at ${handlerFile} has no default export` }),
            )
          }

          // Parse JSON body for non-GET requests.
          let body: unknown = undefined
          const contentType = String(req.headers['content-type'] ?? '')
          if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
            const raw = await readBody(req)
            if (raw.length > 0) {
              if (contentType.includes('application/json')) {
                try {
                  body = JSON.parse(raw.toString('utf8'))
                } catch {
                  body = raw.toString('utf8')
                }
              } else {
                body = raw.toString('utf8')
              }
            }
          }

          const vercelReq = Object.assign(req, {
            body,
            query: Object.fromEntries(url.searchParams.entries()),
          })
          const vercelRes = wrapResponse(res)
          await handler(vercelReq, vercelRes)
        } catch (err) {
          console.error(`[api] ${url.pathname} failed:`, err)
          if (!res.headersSent) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(JSON.stringify({ error: 'Internal server error' }))
          } else {
            res.end()
          }
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Vite only exposes VITE_-prefixed env vars to client code. The API handlers
  // also need unprefixed vars like JWT_SECRET and POSTGRES_URL in process.env,
  // so merge everything from .env / .env.local into process.env at startup.
  const env = loadEnv(mode, process.cwd(), '')
  for (const [k, v] of Object.entries(env)) {
    if (process.env[k] === undefined) process.env[k] = v
  }

  return {
    plugins: [react(), apiHandlers()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('framer-motion')) return 'framer-motion';
            if (id.includes('data/battles/')) return 'battle-data';
            if (id.includes('data/battleFacts') || id.includes('data/battleCoordinates') || id.includes('data/battleImages')) return 'battle-meta';
            if (id.includes('data/campaigns') || id.includes('data/achievements')) return 'game-meta';
            // Non-default locales are code-split so they're only fetched when
            // the user visits a /fr or /es route. en.json stays inlined into
            // the main bundle (it's the synchronous fallback).
            if (id.includes('i18n/locales/fr.json')) return 'i18n-fr';
            if (id.includes('i18n/locales/es.json')) return 'i18n-es';
            if (id.includes('node_modules/react-i18next') || id.includes('node_modules/i18next')) return 'i18n-lib';
          },
        },
      },
    },
  }
})
