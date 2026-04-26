<script lang="ts">
	import { Button, Dialog } from 'bits-ui';
	import Icon from '@iconify/svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		open: boolean;
		title: string;
		confirmLabel?: string;
		confirmDisabled?: boolean;
		onconfirm: () => void;
		oncancel: () => void;
		children: Snippet;
	};

	let {
		open = $bindable(),
		title,
		confirmLabel = 'uložit změny',
		confirmDisabled = false,
		onconfirm,
		oncancel,
		children,
	}: Props = $props();
</script>

<Dialog.Root bind:open>
	<Dialog.Portal>
		<Dialog.Overlay />
		<Dialog.Content>
			<header class="modal-header">
				<Dialog.Title>{title}</Dialog.Title>
				<Dialog.Close>
					{#snippet child({ props })}
						<Button.Root {...props} data-button-variant="ghost" data-button-round>
							<Icon icon="material-symbols:close" />
						</Button.Root>
					{/snippet}
				</Dialog.Close>
			</header>

			<div class="edit-form">
				{@render children()}
			</div>

			<footer class="modal-footer">
				<Button.Root data-button-variant="ghost" onclick={oncancel}>zrušit</Button.Root>
				<Button.Root
					data-button-variant="accent"
					onclick={onconfirm}
					disabled={confirmDisabled}
				>
					{confirmLabel}
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

.edit-form {
	flex: 1;
	overflow-y: auto;
	padding: 1.2rem;
	display: flex;
	flex-direction: column;
	gap: 0.9rem;

	:global(textarea) {
		all: unset;
		width: 100%;
		min-height: 4.5rem;
		resize: vertical;
		box-sizing: border-box;
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
</style>
