<script lang="ts">
import { page } from '$app/state';
</script>

<svelte:head>
	<title>Zásady ochrany osobních údajů — Krvavá hodina odbila</title>
</svelte:head>

<main>
	<div class="header">
		<h1>Zásady ochrany osobních údajů</h1>
		<p class="updated">Naposledy aktualizováno: 11. května 2026</p>
	</div>

	<section>
		<h2>1. Úvod</h2>
		<p>
			Tyto zásady ochrany osobních údajů popisují, jak rozšíření <strong>Krvavá hodina
			odbila</strong> pro platformu Twitch a jeho doprovodná webová aplikace
			(<strong>{page.url.host}</strong>) shromažďují, používají a chrání osobní údaje uživatelů.
		</p>
		<p>
			Správcem osobních údajů je Daniel Vondra, Česká republika (dále jen „správce“).
		</p>
		<p>
			Aplikace je určena pro český komunitní stream Blood on the Clocktower. Webová aplikace
			slouží broadcasterům ke správě herních dat, Twitch rozšíření tato data zobrazuje
			divákům v reálném čase. Tyto zásady se vztahují na všechny uživatele webového editoru
			i diváky Twitch rozšíření.
		</p>
	</section>

	<section>
		<h2>2. Jaké osobní údaje shromažďujeme</h2>
		<p>Shromažďujeme pouze údaje nezbytné pro provoz aplikace:</p>

		<h3>Údaje Twitch účtu</h3>
		<p>
			Při přihlášení prostřednictvím Twitch OAuth obdržíme z Twitche následující údaje:
		</p>
		<ul>
			<li>Twitch uživatelské ID</li>
			<li>Twitch přihlašovací jméno (login)</li>
			<li>Zobrazované jméno (display name)</li>
			<li>E-mailová adresa</li>
		</ul>

		<h3>Herní data zadaná broadcastery</h3>
		<p>
			Broadcasteři mohou do aplikace zadávat:
		</p>
		<ul>
			<li>Jména hráčů a jejich herní role (postavy, zarovnání)</li>
			<li>Volitelně: uživatelská jména hráčů na externích platformách (např. Twitch handle)</li>
		</ul>
		<p>
			Tato data jsou veřejně viditelná divákům prostřednictvím Twitch rozšíření. Jména hráčů jsou herní přezdívky zadané broadcasterem — nemusí se jednat o skutečná jména.
		</p>
		<p>
			<strong>Upozornění:</strong> Broadcaster je plně zodpovědný za to, že má oprávnění (např. souhlas hráčů) zadávat jejich přezdívky a uživatelská jména do aplikace za účelem jejich zobrazení ve streamu.
		</p>

		<h3>Technické údaje</h3>
		<p>
			Při používání webového editoru mohou být automaticky zaznamenány standardní technické
			informace (např. IP adresa, typ prohlížeče) ze strany hostingového poskytovatele Vercel.
			Aplikace sama o sobě žádné analytické nástroje ani cookies třetích stran nepoužívá.
		</p>
	</section>

	<section>
		<h2>3. Jak údaje shromažďujeme</h2>
		<ul>
			<li>
				<strong>Twitch OAuth:</strong> Údaje účtu jsou předány jednorázově při přihlášení
				přes Twitch. Přihlášení je možné pouze pro broadcastery používající editor.
				Diváci Twitch rozšíření se nepřihlašují a žádné jejich osobní údaje nejsou
				aplikací ukládány.
			</li>
			<li>
				<strong>Manuální zadání:</strong> Herní data (jména hráčů, postavy) zadává
				broadcaster ručně v editoru.
			</li>
			<li>
				<strong>Session cookies:</strong> Webový editor používá session cookie výhradně
				pro udržení přihlášeného stavu. Jedná se o technicky nezbytný cookie bez
				sledovacího účelu.
			</li>
		</ul>
	</section>

	<section>
		<h2>4. Právní základ zpracování (GDPR)</h2>
		<p>Osobní údaje zpracováváme na základě těchto právních titulů:</p>
		<ul>
			<li>
				<strong>Plnění smlouvy (čl. 6 odst. 1 písm. b) GDPR):</strong> Údaje Twitch účtu
				jsou nezbytné pro provoz přihlášení a přístupu k editoru.
			</li>
			<li>
				<strong>Oprávněný zájem (čl. 6 odst. 1 písm. f) GDPR):</strong> Herní data
				slouží k zajištění funkcionality rozšíření v rámci streamu.
			</li>
		</ul>
	</section>

	<section>
		<h2>5. Jak údaje používáme</h2>
		<ul>
			<li>K ověření identity broadcastera a zajištění přístupu k editoru.</li>
			<li>K zobrazení herního stavu divákům prostřednictvím Twitch rozšíření.</li>
			<li>K provozování a zlepšování aplikace.</li>
		</ul>
		<p>
			Osobní údaje <strong>neprodáváme</strong> ani je neposkytujeme třetím stranám
			za účelem marketingu nebo profilování.
		</p>
	</section>

	<section>
		<h2>6. Sdílení údajů s třetími stranami</h2>
		<p>
			Pro provoz aplikace využíváme následující zpracovatele dat, kteří mohou mít
			přístup k osobním údajům v rozsahu nezbytném pro poskytování jejich služby:
		</p>
		<ul>
			<li>
				<strong>Twitch Interactive, Inc.</strong> — platforma pro autentizaci (OAuth).
				<a href="https://www.twitch.tv/p/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">Zásady ochrany soukromí Twitch</a>
			</li>
			<li>
				<strong>Vercel Inc.</strong> — hosting webové aplikace a API.
				<a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Zásady ochrany soukromí Vercel</a>
			</li>
			<li>
				<strong>Turso (ChiselStrike Inc.)</strong> — cloudová databáze.
				<a href="https://turso.tech/privacy-policy" target="_blank" rel="noopener noreferrer">Zásady ochrany soukromí Turso</a>
			</li>
		</ul>
		<p>
			Tito zpracovatelé jsou vázáni vlastními zásadami ochrany osobních údajů a smluvními
			závazky v oblasti datové bezpečnosti.
		</p>
	</section>

	<section>
		<h2>7. Uchovávání dat</h2>
		<p>
			Údaje Twitch účtu a herní data jsou uchovávána po dobu existence vašeho účtu
			v aplikaci. Po smazání účtu jsou přidružené osobní údaje odstraněny.
		</p>
		<p>
			Svůj účet a všechna přidružená data můžete kdykoli smazat kontaktováním správce
			(viz sekce Kontakt níže).
		</p>
	</section>

	<section>
		<h2>8. Bezpečnost</h2>
		<p>
			Přijímáme přiměřená technická a organizační opatření k ochraně osobních údajů
			před neoprávněným přístupem nebo zneužitím. Komunikace se serverem probíhá
			výhradně přes šifrované HTTPS spojení. Přístup k databázi je omezen na
			serverovou část aplikace.
		</p>
		<p>
			Žádný systém přenosu dat přes internet není zcela bezpečný. Nemůžeme zaručit
			absolutní bezpečnost, ale snažíme se tato rizika minimalizovat.
		</p>
	</section>

	<section>
		<h2>9. Ochrana soukromí dětí</h2>
		<p>
			Aplikace není určena osobám mladším 13 let. Vědomě neshromažďujeme osobní údaje
			dětí. Pokud zjistíme, že jsme neúmyslně obdrželi údaje dítěte, neprodleně je
			smažeme.
		</p>
	</section>

	<section>
		<h2>10. Vaše práva (GDPR)</h2>
		<p>
			Pokud jste rezidentem Evropské unie, máte vůči svým osobním údajům následující práva:
		</p>
		<ul>
			<li><strong>Právo na přístup</strong> — požádat o kopii svých uložených osobních údajů.</li>
			<li><strong>Právo na opravu</strong> — požádat o opravu nepřesných nebo neúplných údajů.</li>
			<li><strong>Právo na výmaz</strong> — požádat o smazání svých osobních údajů (právo být zapomenut).</li>
			<li><strong>Právo na omezení zpracování</strong> — požádat o omezení zpracování svých údajů.</li>
			<li><strong>Právo na přenositelnost</strong> — obdržet své osobní údaje ve strojově čitelném formátu.</li>
			<li><strong>Právo vznést námitku</strong> — vznést námitku proti zpracování na základě oprávněného zájmu.</li>
		</ul>
		<p>
			Svá práva můžete uplatnit kontaktováním správce (viz sekce Kontakt). Na vaši žádost
			odpovíme do 30 dnů. V případě, že nejste spokojeni s naší odpovědí, máte právo
			podat stížnost u příslušného dozorového úřadu — v ČR je jím
			<a href="https://www.uoou.cz/" target="_blank" rel="noopener noreferrer">Úřad pro ochranu osobních údajů (UOOU)</a>.
		</p>
	</section>

	<section>
		<h2>11. Mezinárodní přenosy dat</h2>
		<p>
			Data jsou zpracovávána a uložena na serverech ve Spojených státech amerických
			(Vercel, Turso). Tyto přenosy se uskutečňují v souladu s platnými mechanismy
			ochrany dat (např. prostřednictvím Standardních smluvních doložek schválených Evropskou komisí nebo Rámcem pro ochranu dat), přičemž poskytovatelé dodržují příslušné standardy pro přenos dat mimo EU/EHP.
		</p>
	</section>

	<section>
		<h2>12. Změny těchto zásad</h2>
		<p>
			Tyto zásady ochrany osobních údajů můžeme čas od času aktualizovat. O podstatných
			změnách budeme informovat prostřednictvím Twitch kanálu nebo změnou data
			„Naposledy aktualizováno“ v záhlaví této stránky. Doporučujeme tuto stránku
			pravidelně kontrolovat.
		</p>
	</section>

	<section>
		<h2>13. Kontakt</h2>
		<p>
			Správce údajů: Daniel Vondra, Česká republika<br>
			V případě dotazů, žádostí nebo stížností ohledně ochrany osobních údajů nás
			kontaktujte e-mailem na adrese
			<a href="mailto:crasty01@gmail.com">crasty01@gmail.com</a>.
		</p>
	</section>
</main>

<style>
main {
	padding: 2rem;
	max-width: 52rem;
	display: flex;
	flex-direction: column;
	gap: 2rem;
}

.header {
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
}

h1 {
	font-size: var(--size-2xl);
}

h2 {
	font-size: var(--size-lg);
	margin-bottom: 0.75rem;
}

h3 {
	font-size: var(--size-base);
	font-weight: 600;
	margin-top: 1rem;
	margin-bottom: 0.4rem;
}

.updated {
	opacity: 0.5;
	font-size: 0.875rem;
}

section {
	display: flex;
	flex-direction: column;
	border-top: 1px solid light-dark(var(--color-neutral-200), var(--color-neutral-700));
	padding-top: 1.5rem;
}

ul {
	padding-left: 1.5rem;
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
	margin-top: 0.5rem;
	margin-bottom: 0.5rem;
}

p {
	line-height: 1.6;
}

p + p {
	margin-top: 0.6rem;
}

a {
	color: inherit;
	text-underline-offset: 0.2rem;
}
</style>