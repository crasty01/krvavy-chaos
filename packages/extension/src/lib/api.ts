import type { GameState } from '@krvavy-chaos/shared';

// TODO: replace with actual API base URL from environment variable
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export const fetchGameState = async (sessionId: string): Promise<GameState | null> => {
  try {
    const response = await fetch(`${API_BASE}/api/session/${sessionId}`);
    if (!response.ok) return null;
    return (await response.json()) as GameState;
  } catch {
    return null;
  }
};
