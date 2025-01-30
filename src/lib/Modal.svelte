<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cubicInOut } from 'svelte/easing';
	import { self } from 'svelte/legacy';

	interface Props {
		close(): void;
		children?: Snippet;
	}

	let { close, children }: Props = $props();
</script>

<svelte:window
	on:keydown={(e) => {
		e.key === 'Escape' && close();
	}}
/>

<button onmousedown={self(() => close())}>
	<div>
		{@render children?.()}
	</div>
</button>

<style lang="scss">
	button {
		all: unset;
		position: fixed;
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(5px);
		top: 0px;
		left: 0px;
		z-index: 10;

		&:hover {
			background: rgba(0, 0, 0, 0.5);
			color: black;
		}
	}

	div {
		box-sizing: border-box;
		border: 2px solid black;
		padding: 2rem;
		background: white;
		display: flex;
		flex-direction: column;
		max-width: calc(100% - 2rem);
	}
</style>
