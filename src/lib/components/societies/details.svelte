<script lang="javascript">
	import { _ } from 'svelte-i18n';
	import Anchor from '$lib/components/anchor.svelte';

	let { society, userRole } = $props();

	function formatDateTime(dateString) {
		if (!dateString) return '';
		return new Date(dateString).toLocaleString();
	}
</script>

<header>
	<h1>
		<Anchor href={`/societies/${society.id}`}>
			{society.name}
		</Anchor>
	</h1>

	{#if userRole}
		<span>
			{$_('components.societies.details.role')}:
			<strong>{userRole.role}</strong>
		</span>
	{:else}
		<span>
			<em>{$_('components.societies.details.no_membership')}</em>
		</span>
	{/if}

	<form>
		<fieldset>
			<input
				title={$_('components.societies.details.id')}
				value={society.id}
				readonly
				on:click={(e) => e.target.select()}
			/>
		</fieldset>
	</form>
</header>

<main>
	<ul>
		<li>
			<strong>{$_('components.societies.details.location')}:</strong>
			{society.city}, {society.state}, {society.country}
		</li>
		<li><strong>{$_('components.societies.details.postcode')}:</strong> {society.postcode}</li>
		<li><strong>{$_('components.societies.details.currency')}:</strong> {society.currency}</li>
		<li><strong>{$_('components.societies.details.timezone')}:</strong> {society.timezone}</li>
		<li><strong>{$_('components.societies.details.area_unit')}:</strong> {society.areaunit}</li>

		{#if society.finerate}
			<li>
				<strong>{$_('components.societies.details.fine_rate')}:</strong>
				{society.finerate}
				{society.currency}
			</li>
		{/if}

		{#if society.geocoordinate}
			<li>
				<strong>{$_('components.societies.details.coordinates')}:</strong>
				{society.geocoordinate.x}, {society.geocoordinate.y}
			</li>
		{/if}

		<li>
			<strong>{$_('components.societies.details.created')}:</strong>
			{formatDateTime(society.createdAt)}
		</li>
		<li>
			<strong>{$_('components.societies.details.updated')}:</strong>
			{formatDateTime(society.updatedAt)}
		</li>
	</ul>
</main>

<style>
	header {
		display: flex;
		flex-wrap: wrap;
		gap: var(--s);
		align-items: center;
		justify-content: space-between;
		:global(form) {
			border-color: transparent;
			padding: 0;
		}
		:global(fieldset) {
			margin: 0;
			padding: 0;
		}
	}
	main,
	header {
		:global(ul) {
			list-style: none;
			margin: 0;
			padding: 0;
		}
		:global(li) {
			margin: calc(var(--s) / 3);
			padding: calc(var(--s) / 2);
		}
	}
</style>
