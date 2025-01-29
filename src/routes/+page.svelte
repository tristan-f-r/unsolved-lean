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
	An auto-updating collection of holes (<code>sorry</code> and
	<code
		><a href="https://leanprover-community.github.io/mathlib4_docs/Batteries/Util/ProofWanted.html"
			>proof_wanted</a
		></code
	>) in the <a href="https://lean-lang.org/">Lean4</a> theorem prover across established projects.

    The raw data is also available in <a href="https://github.com/ndjson/ndjson-spec">ND-JSON</a> at <a href="./repositories.json">./repositories.json</a>.
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
					<a
						target="_blank"
						href="{repo.url.slice(
							0,
							-'.git'.length
						)}/tree/{repo.branch}/{entry.location}#L{entry.lineNumber}"
					>
						{entry.location.replaceAll('/', '.')}:{entry.lineNumber}
					</a>
				</td>
				<td>
					{#if entry.cause === 'proof_wanted'}
						Proof Wanted (<span
							title="proof_wanted is a declaration that is preferred over sorry, as it allows for tagging entire definitions - in the future, extra metadata may be associated with it."
							>?</span
						>)
					{:else if entry.cause === 'sorry'}
						Sorry (<span
							title="sorry is usually used to mark holes in proofs, and is used in ongoing formalizations. Published libraries prefer proof_wanted."
							>?</span
						>)
					{:else}
						{entry.cause}
					{/if}
				</td>
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

	span[title] {
		text-decoration: underline dotted;
	}
</style>
