import { createHighlighterCore } from 'shiki/core';
import { createOnigurumaEngine } from 'shiki/engine/oniguruma';
import lean4 from '@shikijs/langs/lean4';
import vitesseBlack from '@shikijs/themes/vitesse-black';
import fs from 'node:fs/promises';
import path from 'path';

const rootDir = path.join(path.dirname(new URL(import.meta.url).pathname), '..', '..');

const highlighter = await createHighlighterCore({
	themes: [vitesseBlack],
	langs: [lean4],
	engine: createOnigurumaEngine(import('shiki/wasm'))
});

interface Hole {
	lineNumber: number;
	cause: string;
}

const needles = ['sorry', 'proof_wanted'];

export async function parseLeanFile(file: string): Promise<Hole[]> {
	let holes: Hole[] = [];

	const content = await fs.readFile(file, 'utf8');

	const lines = highlighter.codeToTokensBase(content, {
		lang: 'lean4',
		theme: 'vitesse-black'
	});

	const commentToken = vitesseBlack.tokenColors!.find((token) => token.scope?.includes('comment'))!;
	const commentColor = commentToken.settings.foreground!;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];

		for (const token of line) {
			// this is awkward: shikijs doesn't recognize -- comments! this is a bug
			// so we need to stop when we find -- in the code

			// TODO: this will not work if there is a string that contains --, i.e.
			// doStuff "--"; sorry
			// (instead of fixing this with another patch, this should be fixed by
			// fixing shikijs's syntax highlighting)
			if (token.content.includes('--')) {
				break;
			}

			if (token.color === commentColor) {
				continue;
			}

			for (const needle of needles) {
				if (token.content.startsWith(needle)) {
					holes.push({
						lineNumber: i + 1,
						cause: needle
					});
				}
			}
		}
	}

	return holes;
}
