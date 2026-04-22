DROP INDEX "game_createdBy_idx";--> statement-breakpoint
DROP INDEX "gameEditor_userId_idx";--> statement-breakpoint
DROP INDEX "gamePlayer_gameId_idx";--> statement-breakpoint
DROP INDEX "gamePlayer_playerId_idx";--> statement-breakpoint
DROP INDEX "player_createdBy_idx";--> statement-breakpoint
DROP INDEX "player_name_idx";--> statement-breakpoint
DROP INDEX "playerSocialLink_playerId_idx";--> statement-breakpoint
DROP INDEX "account_userId_idx";--> statement-breakpoint
DROP INDEX "session_token_unique";--> statement-breakpoint
DROP INDEX "session_userId_idx";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
DROP INDEX "verification_identifier_idx";--> statement-breakpoint
ALTER TABLE `platform` ALTER COLUMN "url_template" TO "url_template" text;--> statement-breakpoint
CREATE INDEX `game_createdBy_idx` ON `game` (`created_by`);--> statement-breakpoint
CREATE INDEX `gameEditor_userId_idx` ON `game_editor` (`user_id`);--> statement-breakpoint
CREATE INDEX `gamePlayer_gameId_idx` ON `game_player` (`game_id`);--> statement-breakpoint
CREATE INDEX `gamePlayer_playerId_idx` ON `game_player` (`player_id`);--> statement-breakpoint
CREATE INDEX `player_createdBy_idx` ON `player` (`created_by`);--> statement-breakpoint
CREATE INDEX `player_name_idx` ON `player` (`name`);--> statement-breakpoint
CREATE INDEX `playerSocialLink_playerId_idx` ON `player_social_link` (`player_id`);--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);