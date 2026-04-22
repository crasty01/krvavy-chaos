import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
if (!env.DATABASE_AUTH_TOKEN) throw new Error('DATABASE_AUTH_TOKEN is not set');

const client = createClient({ url: env.DATABASE_URL, authToken: env.DATABASE_AUTH_TOKEN });

export const db = drizzle(client, { schema });


export type User = typeof schema.user.$inferSelect;
export type Session = typeof schema.session.$inferSelect;
export type Account = typeof schema.account.$inferSelect;
export type Verification = typeof schema.verification.$inferSelect;
export type Player = typeof schema.player.$inferSelect;
export type Platform = typeof schema.platform.$inferSelect;
export type PlayerSocialLink = typeof schema.playerSocialLink.$inferSelect;
export type Game = typeof schema.game.$inferSelect;
export type GamePlayer = typeof schema.gamePlayer.$inferSelect;
export type GameEditor = typeof schema.gameEditor.$inferSelect;

export type GameFull = Game & {
	gamePlayers: Array<GamePlayer & { player: Player }>;
	editors: Array<GameEditor & { user: User }>;
	creator: User;
};