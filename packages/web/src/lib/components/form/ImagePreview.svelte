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
		trigger
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay />
		<Dialog.Content>
			<header>
				<Dialog.Title>
					image preview
				</Dialog.Title>
				<Dialog.Description>
					<Button.Root href={src}>
						<span>{src}</span>
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
		grid-template-columns: 1fr auto 1fr;
		align-items: center;

		:global(& [data-dialog-title]) {
			justify-self: flex-start;
		}

		:global(& [data-dialog-close]) {
			justify-self: flex-end;
		}

		:global(& [data-dialog-description]) {
			
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