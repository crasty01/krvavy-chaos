WALKTHROUGH GUIDE
Krvava hodina odbila - Blood on the Clocktower Overlay
Version 1.0


ABOUT THIS EXTENSION

This is a video game information overlay built for a Czech-language live stream community that plays Blood on the Clocktower (BotC), a social deduction tabletop game. The extension displays the current game state to viewers: which characters are in play, the night order of character actions, and the player seating arrangement. It is designed to let viewers follow along with the ongoing game session in real time.

No Bits, no chat interaction, no user-generated content, no commerce.

The extension has three anchor types: video overlay, panel, and mobile component. All three show the same game data in layouts appropriate for their context.


TECHNOLOGY

The extension is built with Svelte 5. The compiled code is minified and bundled. Source code is available on request. The backend API is hosted at https://krvavy-chaos-web.vercel.app. The extension communicates with the backend via standard HTTPS fetch requests authenticated with the Twitch Extension JWT. PubSub is used to notify the extension when game data changes so it can re-fetch from the API.


BACKEND SERVICE REQUIREMENT

The extension requires the backend API to be live and a game session to be active on the streamer's channel for the full viewer experience to function. The review channel will be live with an active game session during the review.


CONFIGURATION (broadcaster setup)

1. Install the extension on the channel.
2. Open the extension configuration page (the "Configure" button in the Extensions manager dashboard).
3. In the "Twitch Id vlastníka hry" field, enter the Twitch user ID of the channel that owns the game session. This is typically the same as the broadcaster's own Twitch user ID, but can be different if the broadcaster is linking to a game session owned by another channel.
4. Optionally adjust the four overlay layout fields: offset x (horizontal position in vmin), offset y (vertical position in vmin), token radius (distance of character tokens from center in vmin), and token size (diameter of tokens in vmin). These control where the circular token arrangement appears on the video overlay. Default values are pre-filled and work for most layouts.
5. Click the save button (the floppy disk icon). A checkmark confirms a successful save. The configuration is then broadcast to all connected viewers automatically.
6. Activate the extension on the channel.


VIEWER EXPERIENCE - FIRST LOAD

When a viewer opens the extension for the first time during an active game, they are shown a spoiler gate screen asking whether they want to see secret character identities. The two choices are "Prozradit postavy" (reveal characters - shows which character each player has been assigned) and "Hadat sam/sama" (stay in prediction mode - hides character assignments so the viewer can try to guess). This preference is saved to localStorage and remembered for that game session. It can be changed at any time via a button in the panel header.


VIEWER EXPERIENCE - MAIN CONTENT

The main interface has three tabs:

Postavy (Characters) - Lists all characters in the current script grouped by team (Good, Evil, Neutral). Each character shows an avatar image, name, and ability text. Clicking a character expands it to show flavor text and any jinx interactions with other characters.

Poradí noci (Night Order) - Shows the order in which characters act during the game's night phase. Split into two sub-tabs: "Prvni noc" (first night) and "Ostatni noci" (other nights). Each entry shows the character avatar, name, and the reminder text describing what that character does on that night.

Hrace (Players) - Shows the current player seating order numbered 1 through N. Each entry shows the player's name. If the viewer has chosen to reveal character identities, the assigned character and alignment are shown next to the player name. Players may optionally have social media profile links (Twitch, YouTube, etc.) shown as small platform icons.


VIEWER EXPERIENCE - VIDEO OVERLAY

On the video overlay anchor, circular character tokens are arranged in a ring on top of the stream video. Each token is a character portrait. Token color indicates alignment: blue for Good, red for Evil, gray for Neutral. Hovering over a token shows a tooltip with the character name, team, and ability text. A toggle button in the panel drawer allows viewers to show or hide the token ring without changing their other preferences.


ADDITIONAL NOTES

The extension targets Czech-speaking viewers. All UI labels and button text are in Czech. This is intentional and appropriate for the target community.

The companion web app (not part of this extension submission) is a separate web application used by the broadcaster to manage the game session. It is not bundled with the extension but is required as a backend dependency for the extension to display live data.

There are no offsite links within the extension UI itself. Social media links on the Players tab, if present, open player profile pages in a new tab. These are entered by the broadcaster and point to the players' own streaming or social profiles relevant to the game being streamed.