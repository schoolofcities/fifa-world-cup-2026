<script>
	import { base } from '$app/paths';
	import IconRow from './IconRow.svelte';

	let { icons = [], duration = 5 } = $props();
</script>

<IconRow {duration} {icons} />
<a href="https://schoolofcities.utoronto.ca" target="_blank" rel="noopener" class="footer-logo">
	<img src="{base}/sofc-uoft-logo-white.svg" alt="School of Cities / University of Toronto" />
</a>

<style>
	.footer-logo {
		display: inline-block;
		margin-top: 56px;
		transition: opacity 0.2s;
	}

	.footer-logo:hover {
		opacity: 0.8;
	}

	.footer-logo img {
		height: 45px;
		width: auto;
		display: block;
	}
</style>
