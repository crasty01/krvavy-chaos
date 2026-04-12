<script lang="ts">
	import { authClient } from '$lib/auth-client.svelte';
	import { goto } from '$app/navigation';

	const signOut = async () => {
		await authClient.signOut();
		goto('/');
	};
</script>

<header>
	<span class="logo">Krvavý chaos</span>
	<button onclick={signOut} class="sign-out-btn">Odhlásit se</button>
</header>

<style>
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 2rem;
	}

	.logo {
		font-weight: 700;
		font-size: 1.125rem;
	}

	.sign-out-btn {
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.2);
		padding: 0.375rem 1rem;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.sign-out-btn:hover {
		border-color: rgba(255, 255, 255, 0.4);
	}
</style>
