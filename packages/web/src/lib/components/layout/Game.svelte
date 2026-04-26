<script module lang="ts">
	const dateFormatter = new Intl.DateTimeFormat('cs', {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
</script>

<script>
	import Icon from '@iconify/svelte';

	let { id, name, playersLength, editorsLength, updatedAt, isActive = false }: {
		id: string;
		name: string;
		playersLength: number;
		editorsLength: number;
		updatedAt: Date;
		isActive?: boolean;
	} = $props();
</script>

<a href="/dashboard/games/{id}" class="game" class:game--active={isActive}>
	<div class="lead">
		<h3 class="name">{name}</h3>
		<div class="info">
			<span>{playersLength} hráčů</span>
			<span>{editorsLength} moderátorů</span>
			<span>upraveno {dateFormatter.format(updatedAt)}</span>
		</div>
	</div>
	<div class="tail">
		<Icon class="icon" icon="material-symbols:chevron-right" width={20} height={20} />
	</div>
</a>

<style>
.game {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	padding: .8rem 1.6rem;
	padding-left: 0.4rem;
	border-radius: var(--border-radius);
	background-color: light-dark(var(--color-neutral-100), var(--color-neutral-800));
	color: light-dark(var(--color-neutral-900), var(--color-neutral-50));
	text-decoration: none;
	transition: background-color 150ms;
	width: 100%;
	border-left: solid .4rem;
	border-left-color: light-dark(var(--color-neutral-100), var(--color-neutral-800));

	&.game--active {
	border-left-color: light-dark(var(--color-accent-100), var(--color-accent-800));
	}

	&:hover, &:focus {
		background-color: light-dark(var(--color-neutral-200), var(--color-neutral-700));
	}

	& .name {
		font-weight: 600;
		font-size: var(--size-md);
	}

	& .info {
		display: flex;
		flex-direction: row;
		gap: 0.4rem;
		font-size: var(--size-2xs);
		color: light-dark(var(--color-neutral-500), var(--color-neutral-400));

		& > span:not(:first-child) {
			&::before {
				content: '·';
				padding-right: 0.4rem;
			}
		}
	}

	& .lead {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	& .tail {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
}
</style>