<script lang="ts">
import type { BotcAlignment } from '@krvavy-chaos/shared/validate/script';
import * as Overlay from '../overlay';

const seats: Array<BotcAlignment> = [
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