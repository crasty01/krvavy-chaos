<script lang="ts">
import { twitchStore } from './lib/services/twitch.svelte';

twitchStore.listen('broadcast', (target, contentType, message) => {
	console.log('[KRVAVKA]', { target, contentType, message });
})
</script>

<pre>{ twitchStore.debugJson }</pre>