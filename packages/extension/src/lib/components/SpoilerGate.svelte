<script lang="ts">
import { Button } from 'bits-ui';
import Icon from '@iconify/svelte';
import { viewerPreference } from '../stores/preference.svelte';

type Props = {
	variant: 'overlay' | 'panel';
};

let { variant }: Props = $props();
</script>

<div class="spoiler-gate" data-variant={variant}>
	<Icon icon="material-symbols:water-drop" width={28} height={28} />
	<p>Chceš znát tajné identity hráčů?</p>
	<div class="choices">
		<Button.Root data-button-variant="accent" onclick={() => viewerPreference.choose('reveal')}>
			<Icon icon="material-symbols:visibility" />
			<span>Prozradit postavy</span>
		</Button.Root>
		<Button.Root data-button-variant="ghost" onclick={() => viewerPreference.choose('predict')}>
			<Icon icon="material-symbols:visibility-off" />
			<span>Hádat sám/sama</span>
		</Button.Root>
	</div>
</div>

<style>
.spoiler-gate {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	text-align: center;

	& p {
		margin: 0;
		font-size: 0.875rem;
	}

	& .choices {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		justify-content: center;
	}
}

.spoiler-gate[data-variant='overlay'] {
	position: fixed;
	inset: 0;
	background-color: rgba(0, 0, 0, 0.72);
	color: #fff;
	z-index: 200;
	padding: 1rem;
}

.spoiler-gate[data-variant='panel'] {
	flex: 1;
	padding: 1rem;
	color: light-dark(var(--color-neutral-600), var(--color-neutral-400));
}
</style>
