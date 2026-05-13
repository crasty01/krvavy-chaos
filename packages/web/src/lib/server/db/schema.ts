export * from './auth.schema';

import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer, real, index, primaryKey, foreignKey } from "drizzle-orm/sqlite-core";
import { user, session, account } from "./auth.schema";
import type { BotcScript } from '@krvavy-chaos/shared/validate/script';


export const player = sqliteTable("player", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => [
  index("player_createdBy_idx").on(table.createdBy),
  index("player_name_idx").on(table.name),
]);

export const platform = sqliteTable("platform", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  urlTemplate: text("url_template"),
  icon: text("icon"),
});

export const playerSocialLink = sqliteTable(
  "player_social_link",
  {
    id: text("id").primaryKey(),
    playerId: text("player_id")
      .notNull()
      .references(() => player.id, { onDelete: "cascade" }),
    platformId: text("platform_id")
      .notNull()
      .references(() => platform.id, { onDelete: "restrict" }),
    handle: text("handle").notNull(),
  },
  (table) => [index("playerSocialLink_playerId_idx").on(table.playerId)],
);


export const game = sqliteTable("game", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  script: text("script", { mode: "json" }).$type<BotcScript>().notNull(),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
  overlayOffsetX: real("overlay_offset_x"),
  overlayOffsetY: real("overlay_offset_y"),
  overlayRadius: real("overlay_radius"),
  overlayTokenSize: real("overlay_token_size"),
}, (table) => [
  index("game_createdBy_idx").on(table.createdBy),
]);

export const gamePlayer = sqliteTable(
  "game_player",
  {
    id: text("id").primaryKey(),
    gameId: text("game_id")
      .notNull()
      .references(() => game.id, { onDelete: "cascade" }),
    playerId: text("player_id")
      .notNull()
      .references(() => player.id, { onDelete: "restrict" }),
    seatOrder: integer("seat_order").notNull(),
    characterId: text("character_id"),
    alignment: text("alignment", { enum: ["good", "neutral", "evil"] }),
    overlayOffsetX: real("overlay_offset_x"),
    overlayOffsetY: real("overlay_offset_y"),
    overlayRadius: real("overlay_radius"),
    overlayTokenSize: real("overlay_token_size"),
  },
  (table) => [
    index("gamePlayer_gameId_idx").on(table.gameId),
    index("gamePlayer_playerId_idx").on(table.playerId),
  ],
);

export const gameEditor = sqliteTable(
  "game_editor",
  {
    gameId: text("game_id")
      .notNull()
      .references(() => game.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.gameId, table.userId] }), index("gameEditor_userId_idx").on(table.userId)],
);


export const userActiveGameFk = foreignKey({
  columns: [user.activeGameId],
  foreignColumns: [game.id],
});


export const userRelations = relations(user, ({ one, many }) => ({
  sessions: many(session),
  accounts: many(account),
  activeGame: one(game, {
    fields: [user.activeGameId],
    references: [game.id],
  }),
  createdGames: many(game, { relationName: "gameCreator" }),
  createdPlayers: many(player, { relationName: "playerCreator" }),
  editorOf: many(gameEditor),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const playerRelations = relations(player, ({ one, many }) => ({
  creator: one(user, {
    fields: [player.createdBy],
    references: [user.id],
    relationName: "playerCreator",
  }),
  socialLinks: many(playerSocialLink),
  gamePlayers: many(gamePlayer),
}));

export const platformRelations = relations(platform, ({ many }) => ({
  socialLinks: many(playerSocialLink),
}));

export const playerSocialLinkRelations = relations(playerSocialLink, ({ one }) => ({
  player: one(player, {
    fields: [playerSocialLink.playerId],
    references: [player.id],
  }),
  platform: one(platform, {
    fields: [playerSocialLink.platformId],
    references: [platform.id],
  }),
}));

export const gameRelations = relations(game, ({ one, many }) => ({
  creator: one(user, {
    fields: [game.createdBy],
    references: [user.id],
    relationName: "gameCreator",
  }),
  gamePlayers: many(gamePlayer),
  editors: many(gameEditor),
}));

export const gamePlayerRelations = relations(gamePlayer, ({ one }) => ({
  game: one(game, {
    fields: [gamePlayer.gameId],
    references: [game.id],
  }),
  player: one(player, {
    fields: [gamePlayer.playerId],
    references: [player.id],
  }),
}));

export const gameEditorRelations = relations(gameEditor, ({ one }) => ({
  game: one(game, {
    fields: [gameEditor.gameId],
    references: [game.id],
  }),
  user: one(user, {
    fields: [gameEditor.userId],
    references: [user.id],
  }),
}));

