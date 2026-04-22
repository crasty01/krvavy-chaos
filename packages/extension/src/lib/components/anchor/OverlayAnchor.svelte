<script lang="ts">
import type { Alignment } from '@krvavy-chaos/shared/index';
import * as Overlay from '../overlay';

const seats: Array<Alignment> = [
	'good',
	'evil',
	'evil',
	'evil',
	'evil',
	'good',
	'good',
	'good',
	'good',
	'good',
	'good',
	'good',
]
</script>

<Overlay.Root>
	{#each seats as alignment, i}
		<Overlay.Token seatIndex={i} numberOfSeats={seats.length} playerAlignment={alignment} />
	{/each}
</Overlay.Root>