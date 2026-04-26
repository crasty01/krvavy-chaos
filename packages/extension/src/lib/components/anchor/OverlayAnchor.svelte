<script lang="ts">
import * as Overlay from '../overlay';
import { game } from '../../functions/game.svelte';
import { Avatar, Tooltip } from 'bits-ui';
import Icon from '@iconify/svelte';
import { TEAM_LABELS } from '@krvavy-chaos/shared/validate/script';
import { getAlignedCharacterImage } from '@krvavy-chaos/shared/utils/script';

let gameData = $derived(game.data);

const gamePlayers = $derived(gameData?.gamePlayers);
const characterTether = Tooltip.createTether<Overlay.CharacterTooltipPayload>();
</script>

<div class="overlay-anchor">
	{#if gamePlayers}
		<Tooltip.Provider>
			<Overlay.Root>
				{#each gamePlayers as gamePlayer, i}
					<Overlay.Token
						seatIndex={i}
						numberOfSeats={gamePlayers.length}
						gamePlayer={gamePlayer}
						characterTether={characterTether}
					/>
				{/each}
			</Overlay.Root>

			<Tooltip.Root
				delayDuration={50}
				tether={characterTether}
			>
				{#snippet children({ payload })}
					<Tooltip.Portal>
						<Tooltip.Content>
							<Tooltip.Arrow />
								<section class="character-tooltip" data-alignment={payload?.gamePlayer.alignment ?? 'unknown'}>
									{#if payload}
										<header>
											<Avatar.Root>
												<Avatar.Image
													src={getAlignedCharacterImage(payload.character, payload.gamePlayer)}
													alt={payload.character.name}
												/>
												<Avatar.Fallback>
													<Icon icon="material-symbols:person" width={20} height={20} />
												</Avatar.Fallback>
											</Avatar.Root>
											<span class="name">{payload.character.name}</span>
											<span class="team">{TEAM_LABELS[payload.character.team]}</span>
										</header>
										<p>{payload.character.ability}</p>
									{:else}
										<p class="unknown">Informace o postavě nebyly nalezeny.</p>
									{/if}
								</section>
						</Tooltip.Content>
					</Tooltip.Portal>
				{/snippet}
			</Tooltip.Root>
		</Tooltip.Provider>
	{/if}
</div>

<style>
.character-tooltip {
	max-width: 28rem;
	display: flex;
	flex-direction: column;
	gap: 0.4rem;

	& header {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	& .name {
		font-weight: 600;
		flex: 1;
	}

	& .team {
		font-size: var(--size-xs, 0.75rem);
		color: var(--align-color);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: 500;
	}

	& .unknown {
		font-size: var(--size-sm);
		opacity: 0.65;
		font-style: italic;
		margin: 0;
	}
}
</style>