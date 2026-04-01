import './app.css';
import App from './App.svelte';

const app = new App({ target: document.getElementById('app')! });

window.Twitch.ext.onAuthorized((auth) => {
  // TODO: store auth token and channel ID for API requests
  console.log('Twitch ext authorized, channelId:', auth.channelId);
});

export default app;
