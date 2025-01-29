interface Repository {
    url: string;
    projectDirs: string[];
    name: string;
    branch: string;
}

export const repositories: Record<string, Repository> = {
    mathlib4: {
        url: "https://github.com/leanprover-community/mathlib4.git",
        projectDirs: ["Mathlib"],
        name: "mathlib4",
        branch: "master"
    },
    FLT: {
        url: "https://github.com/imperialcollegelondon/FLT.git",
        projectDirs: ["FLT"],
        name: "Fermat's Little Theorem",
        branch: "main"
    }
};
