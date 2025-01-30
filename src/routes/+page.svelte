<script lang="ts">
	import { onMount } from 'svelte';
	import { repositories } from '../scraper/repositories.js';
	import rawData from '../scraper/repositories.json?raw';
	import { pushState } from '$app/navigation';
	import Modal from '../lib/Modal.svelte';

	import { PUBLIC_COMMIT, PUBLIC_BUILD_TIME } from '$env/static/public';
	import { page } from '$app/state';

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

	let enabledRepositories = $state(Object.keys(repositories));
</script>

<h1>
	Unsolved @ Lean
	<a href="https://github.com/LeoDog896/unsolved-lean">
		<img src="./github-mark.svg" alt="GitHub Logo" />
	</a>
</h1>

<p>
	An auto-updating collection of wanted proofs (<code>sorry</code> and
	<code
		><a href="https://leanprover-community.github.io/mathlib4_docs/Batteries/Util/ProofWanted.html"
			>proof_wanted</a
		></code
	>) in the <a href="https://lean-lang.org/">Lean4</a> theorem prover across established projects.
	The raw list of wanted holes is also available in
	<a href="https://github.com/ndjson/ndjson-spec">ND-JSON</a> at
	<a href="./repositories.json">./repositories.json</a>.
</p>

<p>
	There are currently {data.length} wanted proofs.
</p>

<h2>
	Repositories
	<button class="help" onclick={() => pushState('', { showModal: true })}>(?)</button>
</h2>

{#if page.state.showModal}
	<Modal close={() => history.back()}>
		<h1>Repositories</h1>

		<p>
			There are {Object.keys(repositories).length} repositories. More can be added by adding to the
			<code
				><a href="https://github.com/LeoDog896/unsolved-lean/blob/main/src/scraper/repositories.ts"
					>repositories.ts</a
				></code
			>
			file.
		</p>

		<ul>
			{#each Object.values(repositories) as repository}
				<li><a href={repository.url}>{repository.name}</a></li>
			{/each}
		</ul>
	</Modal>
{/if}

<div class="repositories">
	{#each Object.entries(repositories) as [id, { name }]}
		<label>
			{name}
			<input
				type="checkbox"
				class="repository"
				name="repositories"
				value={id}
				bind:group={enabledRepositories}
			/>
		</label>
	{/each}
</div>

<h2>Wanted Proofs</h2>

<ul>
	{#each data as entry}
		{#if enabledRepositories.includes(entry.name)}
			{@const repo = repositories[entry.name as string]}
			<li>
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
			</li>
		{/if}
	{/each}
</ul>

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

	.repositories {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;

		label {
			background-color: rgba(0, 0, 0, 0.1);
			padding: 0.25rem;
			cursor: pointer;

			&:hover {
				background-color: rgba(0, 0, 0, 0.2);
			}

			&:active {
				background-color: rgba(0, 0, 0, 0.3);
			}

			&:has(> input:checked) {
				background-color: #adffc1;
			}
		}

		input {
			position: absolute;
			opacity: 0;
			cursor: pointer;
			height: 0;
			width: 0;
		}
	}

	button.help {
		border: none;
		background: none;
		cursor: pointer;
		display: inline-block;
		text-decoration: underline dotted;
		padding: 0;
		margin: 0;
		font-size: inherit;
	}
</style>
