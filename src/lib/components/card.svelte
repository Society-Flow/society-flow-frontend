<script lang="javascript">
	const { children, header } = $props();
</script>

<article class="Card">
	{#if header}
		<header>
			{@render header?.()}
		</header>
	{/if}
	{#if children}
		<main>
			{@render children()}
		</main>
	{/if}
</article>

<style>
	.Card {
		:global(a) {
			display: flex;
      flex-wrap: wrap;
      gap: var(--s);
			padding: calc(var(--s) * 2);
			border: 1px solid var(--c-border);
			background-color: var(--c-bg--secondary);
			border-radius: var(--border-radius);
			text-decoration: underline;
			text-decoration-color: transparent;
			transition: all 150ms ease-in-out;
			outline: 1px solid transparent;
			font-weight: normal;
			&:hover {
				text-decoration: underline var(--c-link);
				border-color: var(--c-bg--secondary);
				background-color: transparent;
				font-weight: bold;
			}
			&:focus {
				outline-color: var(--c-fg);
				font-weight: bold;
			}
			&:active {
				outline-color: var(--c-bg--secondary);
				border-color: var(--c-border);
			}
		}
	}
</style>
