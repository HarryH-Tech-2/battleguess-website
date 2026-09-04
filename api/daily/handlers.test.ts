import { describe, it, expect } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import resultHandler from './result';
import leaderboardHandler from './leaderboard';
import meStatsHandler from '../me/stats';

// Minimal req/res doubles. These tests only reach the paths that run before
// any database access (method checks, validation, auth), which is exactly
// what we want to pin down without a Postgres connection.
function makeReq(over: Partial<{ method: string; body: unknown; query: Record<string, string>; headers: Record<string, string> }>): VercelRequest {
  return {
    method: over.method ?? 'GET',
    body: over.body,
    query: over.query ?? {},
    headers: over.headers ?? {},
  } as unknown as VercelRequest;
}

function makeRes() {
  const out: { status: number; body: unknown; headers: Record<string, string> } = { status: 0, body: undefined, headers: {} };
  const res = {
    status(code: number) { out.status = code; return res; },
    json(body: unknown) { out.body = body; return res; },
    end() { return res; },
    setHeader(k: string, v: string) { out.headers[k] = v; },
  };
  return { res: res as unknown as VercelResponse, out };
}

const today = new Date().toISOString().slice(0, 10);

describe('POST /api/daily/result', () => {
  it('rejects non-POST', async () => {
    const { res, out } = makeRes();
    await resultHandler(makeReq({ method: 'GET' }), res);
    expect(out.status).toBe(405);
  });

  it('answers OPTIONS preflight', async () => {
    const { res, out } = makeRes();
    await resultHandler(makeReq({ method: 'OPTIONS' }), res);
    expect(out.status).toBe(200);
  });

  it('rejects a malformed body with 400 and a reason', async () => {
    const { res, out } = makeRes();
    await resultHandler(makeReq({ method: 'POST', body: { dateKey: 'nope' } }), res);
    expect(out.status).toBe(400);
    expect(out.body).toEqual({ error: 'Invalid dateKey' });
  });

  it('rejects an impossible score', async () => {
    const { res, out } = makeRes();
    await resultHandler(
      makeReq({ method: 'POST', body: { dateKey: today, anonId: 'smoke-test-abcdef', score: 99_999, correct: 3, marks: 'WWH' } }),
      res,
    );
    expect(out.status).toBe(400);
    expect(out.body).toEqual({ error: 'Invalid score' });
  });
});

describe('GET /api/daily/leaderboard', () => {
  it('rejects a bad date', async () => {
    const { res, out } = makeRes();
    await leaderboardHandler(makeReq({ method: 'GET', query: { date: 'bad' } }), res);
    expect(out.status).toBe(400);
  });

  it('rejects non-GET', async () => {
    const { res, out } = makeRes();
    await leaderboardHandler(makeReq({ method: 'POST', query: { date: today } }), res);
    expect(out.status).toBe(405);
  });
});

describe('GET /api/me/stats', () => {
  it('requires a bearer token', async () => {
    const { res, out } = makeRes();
    await meStatsHandler(makeReq({ method: 'GET' }), res);
    expect(out.status).toBe(401);
  });

  it('rejects a garbage token', async () => {
    const { res, out } = makeRes();
    await meStatsHandler(makeReq({ method: 'GET', headers: { authorization: 'Bearer not-a-jwt' } }), res);
    expect(out.status).toBe(401);
  });
});
