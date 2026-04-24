import { mount } from 'svelte';
import './reset.css';
import './base.css';
import './lib/services/twitch.svelte';
import App from './App.svelte';

const app = mount(App, {
  target: document.getElementById('app')!,
});

export default app
