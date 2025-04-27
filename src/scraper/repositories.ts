interface ProjectDirectory {
	location: string;
	ignoredSubfolders: string[];
}

interface Repository {
	url: string;
	projectDirs: ProjectDirectory[];
	name: string;
	branch: string;
}

export const repositories: Record<string, Repository> = {
	mathlib4: {
		url: 'https://github.com/leanprover-community/mathlib4.git',
		projectDirs: [{ location: 'Mathlib', ignoredSubfolders: ['Tactic'] }],
		name: 'mathlib4',
		branch: 'master'
	},
	FLT: {
		url: 'https://github.com/imperialcollegelondon/FLT.git',
		projectDirs: [{ location: 'FLT', ignoredSubfolders: [] }],
		name: "Fermat's Last Theorem",
		branch: 'main'
	},
	Seymour: {
		url: 'https://github.com/Ivan-Sergeyev/seymour.git',
		projectDirs: [{ location: 'Seymour', ignoredSubfolders: [] }],
		name: 'Seymour',
		branch: 'main'
	},
	InfinityCosmos: {
		url: 'https://github.com/emilyriehl/infinity-cosmos.git',
		projectDirs: [{ location: 'InfinityCosmos', ignoredSubfolders: [] }],
		name: '∞-Cosmos',
		branch: 'main'
	},
	APAP: {
		url: 'https://github.com/YaelDillies/LeanAPAP.git',
		projectDirs: [{ location: 'LeanAPAP', ignoredSubfolders: [] }],
		name: 'Arithmetic Progressions - Almost Periodicity',
		branch: 'master'
	},
	CamCombi: {
		url: 'https://github.com/YaelDillies/LeanCamCombi.git',
		projectDirs: [{ location: 'LeanCamCombi', ignoredSubfolders: [] }],
		name: 'Cambridge Combinatorics in Lean',
		branch: 'master'
	}
};
