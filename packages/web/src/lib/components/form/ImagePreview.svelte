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
				náhled
			</Button.Root>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay />
		<Dialog.Content>
			<header class="modal-header">
				<Dialog.Title>náhled obrázku</Dialog.Title>
				<Dialog.Close>
					{#snippet child({ props })}
						<Button.Root {...props} data-button-variant="ghost" data-button-round>
							<Icon icon="material-symbols:close" />
						</Button.Root>
					{/snippet}
				</Dialog.Close>
			</header>

			<img {src} {alt}>

			<footer class="modal-footer">
				<Button.Root data-button-variant="ghost" onclick={oncancel}>zavřít</Button.Root>
				<Button.Root
					data-button-variant="accent"
					href={src}
					target="_blank"
				>
					<span>otevřít obrázek</span>
					<Icon icon="material-symbols:arrow-outward" />
				</Button.Root>
			</footer>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<style>
.modal-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.9rem 1.2rem;
	border-bottom: 1px solid light-dark(var(--color-neutral-200), var(--color-neutral-700));
	flex-shrink: 0;

	:global([data-dialog-title]) {
		font-size: var(--size-sm);
		font-weight: 700;
	}
}


.modal-footer {
	display: flex;
	justify-content: flex-end;
	gap: 0.5rem;
	padding: 0.9rem 1.2rem;
	border-top: 1px solid light-dark(var(--color-neutral-200), var(--color-neutral-700));
	flex-shrink: 0;
}

:global([data-dialog-content].image-preview-content) {
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
			max-width: 20rem;
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