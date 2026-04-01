import type { RequestHandler } from './$types';

// TODO: implement session management endpoints
// GET  /api/session        — list sessions for authenticated user
// POST /api/session        — create a new session
// GET  /api/session/:id    — get session state (used by extension)
// PUT  /api/session/:id    — update game state (editors only)

export const GET: RequestHandler = async () => {
  return new Response(JSON.stringify({ message: 'TODO' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
