<script lang="ts">
import type { ExtensionGame } from '@krvavy-chaos/shared/types/web';

// Unused — present so About shares the same tab component interface
let { data: _data }: { data?: ExtensionGame } = $props();

const WEB_URL = 'https://krvavy-chaos-web.vercel.app';
const version = __APP_VERSION__;
</script>

<div class="about">
	<div class="about-content">
		<section class="about-section">
			<h3>Krvavá hodina odbila</h3>
			<p class="about-desc">
				Overlay rozšíření pro Twitch stream česky mluvené komunity hry
				Blood on the Clocktower.
			</p>
		</section>

		<section class="about-section">
			<h4>Kontakt</h4>
			<span class="about-email">crasty01@gmail.com</span>
		</section>

		<section class="about-section">
			<h4>Právní informace</h4>
			<a href="{WEB_URL}/privacy" target="_blank" rel="noopener noreferrer" class="about-link">
				Zásady ochrany osobních údajů
			</a>
		</section>
	</div>

	<footer class="about-footer">
		<span>verze {version}</span>
	</footer>
</div>

<style>
.about {
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
	height: 100%;
	justify-content: space-between;
}

.about-content {
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
	justify-content: flex-start;
}

.about-section {
	display: flex;
	flex-direction: column;
	gap: 0.35rem;

	& h3 {
		font-size: 0.9rem;
		font-weight: 700;
	}

	& h4 {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		opacity: 0.55;
	}
}

.about-desc {
	font-size: 0.8rem;
	line-height: 1.5;
	opacity: 0.8;
	margin: 0;
}

.about-email {
	font-size: 0.8rem;
	font-family: var(--font-mono);
	opacity: 0.85;
}

.about-link {
	font-size: 0.8rem;
	color: inherit;
	text-underline-offset: 0.2rem;
	opacity: 0.85;

	&:hover {
		opacity: 1;
	}
}

.about-footer {
	font-size: 0.7rem;
	font-family: var(--font-mono);
	opacity: 0.4;
	padding-bottom: 1rem;
}
</style>
