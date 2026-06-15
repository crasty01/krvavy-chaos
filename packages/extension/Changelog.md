Changelog 1.2.0
Changes
Players tab Twitch links only: Player profile links now exclusively link to a player's Twitch channel (when available) and show a live indicator if the player is currently streaming. External links to other platforms (YouTube, Instagram, etc.) have been removed to comply with Twitch Extension policies (rule 4.6.1).

Changelog 1.1.0
New Features
Predict mode — overlay: In predict mode, the video overlay now shows interactive guess tokens. Viewers can click any token to open a character picker and assign their guess for each player seat.
Predict mode — players panel: The Players tab now shows a character picker per player row when in predict mode, with guesses persisted to localStorage per game session.
Settings tab: New panel tab with viewer-adjustable overlay position (X/Y offset) and size (radius, token size) sliders, plus a token style toggle (image / color / none). Overrides are saved per-channel and can be reset to the broadcaster's defaults.
About tab: New panel tab showing app name, contact email, privacy policy link, and app version.
Loading states: A spinner is shown on both the panel and the overlay while game data is being fetched (with a 10 s timeout fallback).
Character avatars on overlay tokens: Overlay tokens now render the actual character portrait image (when token style is set to "image").
Mobile platform support: On mobile, the component anchor (panel) is shown directly instead of the overlay+drawer layout.

Changes
Overlay config is now dynamic: OverlayRoot accepts a config prop (radius, tokenSize, offsetX, offsetY) instead of hardcoded values. Broadcasters configure defaults; viewers can override them via the Settings tab.
Config save now broadcasts via PubSub: Saving broadcaster config now calls extension.send('broadcast', …) so connected viewers receive the update immediately (was previously commented out).
Overlay visibility toggle removed: The hide/show overlay button has been removed from the panel header. The overlay is always shown when the viewer is in reveal or predict mode.
Night order sentinel labels expanded: minioninfo and demoninfo entries now display proper Czech labels in the Night Order tab.
Players tab social links simplified: Multiple per-platform social links replaced with a single profile URL link per player.