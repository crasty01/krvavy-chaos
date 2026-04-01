export type Player = {
  id: string;
  twitchUserId: string;
  displayName: string;
  character?: string;
  isAlive: boolean;
  notes?: string;
};

export type GameState = {
  sessionId: string;
  phase: 'day' | 'night' | 'voting' | 'idle';
  round: number;
  players: Player[];
  storyteller?: string;
  updatedAt: number;
};

export type Session = {
  id: string;
  name: string;
  ownerId: string;
  gameState: GameState;
  stateVersion: number;
  createdAt: number;
  updatedAt: number;
};

export type SessionEditor = {
  sessionId: string;
  userId: string;
  displayName: string;
  addedAt: number;
};

export type SessionChannel = {
  sessionId: string;
  channelId: string;
  displayName: string;
  addedAt: number;
};

export type PubSubMessage = {
  type: 'state_updated';
  version: number;
};
