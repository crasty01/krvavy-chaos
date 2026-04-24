import { mount } from 'svelte';
import '@krvavy-chaos/shared/css/reset.css';
import '@krvavy-chaos/shared/css/tokens.css';
import '@krvavy-chaos/shared/css/components.css';
import './base.css';
import './lib/services/twitch.svelte';
import App from './App.svelte';

const app = mount(App, {
  target: document.getElementById('app')!,
});

export default app
