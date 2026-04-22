<script lang="ts">
	import Icon from '@iconify/svelte';
import { Button, Dialog } from 'bits-ui';

let { src, alt = '' }: {
	src: string;
	alt?: string;
} = $props();

let isOpen = $state(false);
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger>
		{#snippet child({props})}
			<Button.Root {...props} data-button-variant="" style="border-top-left-radius: 0; border-bottom-left-radius: 0;">
				preview
			</Button.Root>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay />
		<Dialog.Content>
			<header>
				<Dialog.Description>
					<Button.Root href={src} target="_blank">
						<span class="ellipsis">{src}</span>
						<Icon icon="material-symbols:arrow-outward" width=20 height=20 />
					</Button.Root>
				</Dialog.Description>
				<Dialog.Close>
					{#snippet child({ props })}
						<Button.Root {...props} data-button-variant="ghost" data-button-round>
							<Icon icon="material-symbols:close" />
						</Button.Root>
					{/snippet}
				</Dialog.Close>
			</header>
			<img {src} {alt}>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<style>
:global([data-dialog-content]) {
	& header {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 1rem;
		align-items: center;

		:global(& [data-dialog-title]) {
			justify-self: flex-start;
		}

		:global(& [data-dialog-close]) {
			justify-self: flex-end;
		}

		:global(& [data-dialog-description] .ellipsis) {
			max-width: 40rem;
		}
	}

	& img {
		max-width: 100%;
		max-height: 100%;
		margin-inline: auto;
		object-fit: contain;
		border-radius: var(--border-radius);
		overflow: hidden;
	}
}
</style>