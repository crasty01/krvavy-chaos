<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '@iconify/svelte';

	let {
		type = 'info',
		title,
		dismissible = false,
		onclose,
		icon,
		children,
	}: {
		type?: 'info' | 'success' | 'warning' | 'error';
		title?: string;
		dismissible?: boolean;
		onclose?: () => void;
		icon?: Snippet;
		children: Snippet;
	} = $props();

	let isVisible = $state(true);

	const handleClose = () => {
		isVisible = false;
		onclose?.();
	};
</script>

{#if isVisible}
	<div
		class="infobox"
		class:infobox--info={type === 'info'}
		class:infobox--success={type === 'success'}
		class:infobox--warning={type === 'warning'}
		class:infobox--error={type === 'error'}
		role="alert"
	>
		<div class="infobox__icon">
			{#if icon}
				{@render icon()}
			{:else if type === 'info'}
				<Icon width={24} height={24} icon="material-symbols:info-outline" />
			{:else if type === 'success'}
				<Icon width={24} height={24} icon="material-symbols:check-circle-outline" />
			{:else if type === 'warning'}
				<Icon width={24} height={24} icon="material-symbols:warning-outline" />
			{:else if type === 'error'}
				<Icon width={24} height={24} icon="material-symbols:error-outline" />
			{/if}
		</div>

		<div class="infobox__content">
			{#if title}
				<h4 class="infobox__title">{title}</h4>
			{/if}
			<div class="infobox__message">
				{@render children()}
			</div>
		</div>

		{#if dismissible}
			<button class="infobox__close" aria-label="Zavřít" onclick={handleClose}>
				✕
			</button>
		{/if}
	</div>
{/if}

<style>
.infobox {
	--clr-bg-light: var(--color-accent-100);
	--clr-bg-dark: var(--color-accent-900);
	--clr-fg-light: var(--color-accent-800);
	--clr-fg-dark: var(--color-accent-200);

	display: flex;
	align-items: center;
	gap: var(--size-xs);
	padding: 1rem;
	width: 100%;
	border-radius: var(--border-radius);
	margin-bottom: 1rem;

	& .infobox__icon {
		font-size: 1.25rem;
		line-height: 1;
		margin-top: 0.125rem;
		flex-shrink: 0;
	}

	& .infobox__content {
		flex: 1;
	}

	& .infobox__title {
		margin: 0 0 0.25rem 0;
		font-weight: 600;
		font-size: var(--size-sm);
	}

	& .infobox__message {
		font-size: 0.875rem;
		color: inherit;
		line-height: 1.4;
	}

	& .infobox__close {
		all: unset;
		cursor: pointer;
		font-size: 1.125rem;
		opacity: 0.5;
		line-height: 1;
		transition: opacity 0.15s ease;

		&:hover {
			opacity: 1;
		}
	}

	&.infobox--info {
		background-color: light-dark(
			oklch(from var(--clr-bg-light) l c 250),
			oklch(from var(--clr-bg-dark) l c 250)
		);
	}

	&.infobox--success {
		background-color: light-dark(
			oklch(from var(--clr-bg-light) l c 145),
			oklch(from var(--clr-bg-dark) l c 145)
		);
	}

	&.infobox--warning {
		background-color: light-dark(
			oklch(from var(--clr-bg-light) l c 70),
			oklch(from var(--clr-bg-dark) l c 70)
		);
	}

	&.infobox--error {
		background-color: light-dark(
			oklch(from var(--clr-bg-light) l c 25),
			oklch(from var(--clr-bg-dark) l c 25)
		);
	}
}
</style>