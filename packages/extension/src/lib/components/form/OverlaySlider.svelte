<script lang="ts">
let { label, value = $bindable(), min, max, step, unit = 'vmin', onchange }: {
	label: string;
	value: number;
	min: number;
	max: number;
	step: number;
	unit?: string;
	onchange?: () => void;
} = $props();
</script>

<div class="overlay-slider">
	<span class="label">{label}</span>
	<input class="number-input" type="number" {min} {max} {step} bind:value {onchange} />
	<span class="unit">{unit}</span>
	<input class="range" type="range" {min} {max} {step} bind:value {onchange} />
</div>

<style>
.overlay-slider {
	display: grid;
	grid-template-columns: auto auto 1fr;
	grid-template-rows: auto auto;
	gap: 0.15rem 0.4rem;
	align-items: center;
}

.label {
	grid-column: 1 / 4;
	grid-row: 1;
	font-size: 0.75rem;
	opacity: 0.8;
}

.number-input {
	grid-column: 1;
	grid-row: 2;
	font-size: 0.75rem;
	font-family: var(--font-mono);
	width: 4.5rem;
	border: 1px solid color-mix(in srgb, currentColor 30%, transparent);
	background: transparent;
	color: inherit;
	padding: 0.15rem 0.3rem;
	border-radius: 0.25rem;
	text-align: right;
	appearance: textfield;
	-moz-appearance: textfield;

	&::-webkit-outer-spin-button,
	&::-webkit-inner-spin-button {
		appearance: none;
		margin: 0;
	}
}

.unit {
	grid-column: 2;
	grid-row: 2;
	font-size: 0.75rem;
	font-family: var(--font-mono);
	opacity: 0.55;
}

.range {
	grid-column: 3;
	grid-row: 2;
	width: 100%;
	accent-color: var(--color-accent-500);
}
</style>
