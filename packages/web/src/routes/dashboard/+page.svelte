<script lang="ts">
import Icon from '@iconify/svelte';
import { authClient } from '$lib/auth-client.svelte';
import { Button } from 'bits-ui';
import { fromStore } from 'svelte/store';

let session = fromStore(authClient.useSession());
</script>

<section>
	<h1>Dashboard</h1>
	<p>Vítej, {session.current.data?.user.name}!</p>
</section>