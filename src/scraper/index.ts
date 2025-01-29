import { spawnSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs/promises";
import { parseLeanFile } from "./parse";
import yoctoSpinner from 'yocto-spinner';
import { repositories } from "./repositories";

async function cloneRepository(repository: string, directory: string): Promise<void> {
    if (await fs.stat(directory).catch(() => undefined)) {
        console.error(`${directory} already exists, pulling...`);

        const pull = spawnSync("git", ["pull"], { cwd: directory, stdio: "inherit" });
        if (pull.status !== 0) {
            console.error(`Failed to pull ${repository}`);
            process.exit(1);
        }

        return;
    }

    console.error(`Cloning ${repository}...`);

    const clone = spawnSync("git", ["clone", repository, directory, "--depth=1"], { stdio: "inherit" });
    if (clone.status !== 0) {
        console.error(`Failed to clone ${repository}`);
        process.exit(1);
    }

    console.error(`Cloned ${repository}!`);
}

const fileDirectory = path.dirname(new URL(import.meta.url).pathname);
const repoDirectory = path.resolve(fileDirectory, "..", "..", "repositories");

fs.mkdir(repoDirectory, { recursive: true });

for (const [name, { url }] of Object.entries(repositories)) {
    await cloneRepository(
        url,
        path.resolve(repoDirectory, name)
    );
}

// https://gist.github.com/lovasoa/8691344
async function* walk(dir: string): AsyncGenerator<string> {
    for await (const d of await fs.opendir(dir)) {
        const entry = path.join(dir, d.name);
        if (d.isDirectory()) yield* walk(entry);
        else if (d.isFile()) yield entry;
    }
}

const repositoriesJSONLocation = path.join(fileDirectory, "repositories.json");

fs.rm(repositoriesJSONLocation, { force: true });

for (const [name, { projectDirs }] of Object.entries(repositories)) {
    for (const projectDir of projectDirs) {
        const spinner = yoctoSpinner({ text: `Scanning project ${projectDir} of repo ${name}` }).start();

        for await (const file of walk(path.resolve(repoDirectory, name, projectDir))) {
            if (file.endsWith(".lean")) {
                const holes = await parseLeanFile(file);
                for (const hole of holes) {
                    const infoPacket = {
                        ...hole,
                        name,
                        projectDir,
                        location: path.relative(path.resolve(repoDirectory, name), file)
                    };

                    fs.appendFile(
                        repositoriesJSONLocation,
                        JSON.stringify(infoPacket) + "\n",
                        {
                            encoding: 'utf8',
                            flag: ''
                        }
                    )
                }
            }
        }

        spinner.success(`Finished scanning project ${projectDir} of repo ${name}`)
    }
}
