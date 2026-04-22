import { mount } from 'svelte';
import './reset.css';
import './base.css';
import App from './App.svelte';
import './lib/services/twitch.svelte';

const app = mount(App, {
  target: document.getElementById('app')!,
});

export default app
