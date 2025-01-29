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
		name: "Fermat's Little Theorem",
		branch: 'main'
	}
};
