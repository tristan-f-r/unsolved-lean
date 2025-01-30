<script lang="ts">
	import { onMount } from 'svelte';
	import { repositories } from '../scraper/repositories.js';
	import rawData from '../scraper/repositories.json?raw';

	import { PUBLIC_COMMIT, PUBLIC_BUILD_TIME } from '$env/static/public';

	const data = JSON.parse(`[${rawData.split('\n').slice(0, -1).join(',')}]`);

	onMount(() => {
		console.log(
			'The raw data is available in GitHub artifacts, or at ./repositories.json. For playing around with it, it is printed here for convenience.'
		);
		console.log(
			'The first object is repository information, and the second is known holes (also available at ./repositories.json):'
		);

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
	The raw data is also available in <a href="https://github.com/ndjson/ndjson-spec">ND-JSON</a> at
	<a href="./repositories.json">./repositories.json</a>.
</p>

<p>
	There are currently {data.length} wanted proofs.
</p>

<table>
	<thead>
		<tr>
			<th>File</th>
		</tr>
	</thead>
	<tbody>
		{#each data as entry}
			{@const repo = repositories[entry.name as string]}
			<tr>
				<td>
					<code>
						<a
							target="_blank"
							href="{repo.url.slice(
								0,
								-'.git'.length
							)}/tree/{repo.branch}/{entry.location}#L{entry.lineNumber}"
						>
							{entry.location.replaceAll('/', '.')}:{entry.lineNumber}
						</a>
					</code>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<footer>
	<a
		href="https://leanprover.zulipchat.com/#narrow/channel/219941-Machine-Learning-for-Theorem-Proving/topic/Incentives.20.26.20sorry-filling.20leaderboard/near/494119396"
		>inspired in zulip</a
	>. built at {PUBLIC_BUILD_TIME}.
	<a href="https://github.com/LeoDog896/unsolved-lean/commit/{PUBLIC_COMMIT}"
		>commit {PUBLIC_COMMIT?.substring(0, 6)}</a
	>
</footer>

<style lang="scss">
	table {
		margin: 0 0 auto 0;
	}

	h1 img {
		display: inline-block;
		height: 1.5rem;
	}

	code {
		background-color: white;
	}

	footer {
		margin-top: 1rem;
		border-top: 1px solid black;
	}
</style>
