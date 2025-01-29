<script lang="ts">
	import { onMount } from 'svelte';
	import { repositories } from '../scraper/repositories.js';
	import rawData from '../scraper/repositories.json?raw';

	const data = JSON.parse(`[${rawData.split('\n').slice(0, -1).join(',')}]`);

	onMount(() => {
		console.log(
			'The raw data is available in GitHub artifacts. For playing around with it, it is printed here for convenience.'
		);
		console.log('The first object is repository information, and the second is known holes:');

		console.log(repositories);
		console.log(data);
	});
</script>

<h1>
	Unsolved @ Lean
	<a href="https://github.com/LeoDog896/unsolved-lean">
		<img src="./github-mark.svg" alt="GitHub Logo" />
	</a>
</h1>

<p>
	A collection of holes (<code>sorry</code> and
	<code
		><a href="https://leanprover-community.github.io/mathlib4_docs/Batteries/Util/ProofWanted.html"
			>proof_wanted</a
		></code
	>) in the <a href="https://lean-lang.org/">Lean4</a> theorem prover across established projects.
</p>

<table>
	<thead>
		<tr>
			<th>File</th>
			<th>Type</th>
		</tr>
	</thead>
	<tbody>
		{#each data as entry}
			{@const repo = repositories[entry.name as string]}
			<tr>
				<td>
					<a href="{repo.url.substring(0, ".git".length)}/tree/{repo.branch}/{entry.location}#L{entry.lineNumber}">
						{entry.location.replace('/', '.')}:{entry.lineNumber}
					</a>
				</td>
				<td>{entry.cause}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table {
		margin: 0 0 auto 0;
	}

	h1 img {
		display: inline-block;
		height: 1.5rem;
	}
</style>
