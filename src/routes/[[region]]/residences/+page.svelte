<script lang="javascript">
	import { _, locale } from 'svelte-i18n';
	import { base } from '$app/paths';
	import { api } from '$lib/api.svelte.js';
	import { userState } from '$lib/states/user.svelte.js';
	import requiresAuth from '$lib/effects/requires-auth.svelte.js';
	import ListResidences from '$lib/components/residences/list.svelte';
	import Page from '$lib/components/routes/page.svelte';
	import Anchor from '$lib/components/anchor.svelte';

	requiresAuth(locale);

	let societies = $state([]);
	$effect(async () => {
		if (userState?.user?.id) {
			societies = await api.getUserSocieties(userState.user.id);
		}
	});

	let dicResidences = $state({});
	$effect(async () => {
		if (societies) {
			const promises = societies.map(({ id }) =>
				api.getUserResidencesInSociety(id, userState.user.id)
			);
			const res = await Promise.all(promises);
			dicResidences = res.reduce((acc, residences) => {
				for (const r of residences) {
					if (!acc[r.societyId]) acc[r.societyId] = [];
					acc[r.societyId].push(r);
				}
				return acc;
			}, {});
		}
	});
</script>

<Page title={$_('menu.residences')}>
	{#snippet header()}
		<h1>
			{$_('menu.residences')}
		</h1>
		<Anchor href="/create/residences" isButton>
			{$_('menu.create.residences')}
		</Anchor>
	{/snippet}

	{#each societies as society}
		<section>
			<h2>
				<Anchor href={`/societies/${society.id}`}>
					{society.name}
				</Anchor>
			</h2>
			<ListResidences residences={dicResidences[society.id]} />
		</section>
	{/each}
</Page>
