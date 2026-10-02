# Custom Visuals Marketplace

Custom Visuals Marketplace is a web app that ranks and explores the Power BI visuals on Microsoft Marketplace. It shows a leaderboard, a replay of how the ranking changed over time, ratings, popularity, and the words publishers use to describe their visuals. Each visual opens a profile with its screenshots, its history and a link to download its pbiviz file.

The app is published at <https://datachant.github.io/PowerBI-Visuals-Marketplace/> and is rebuilt after every daily refresh of this repository. Nobody needs to sign in to use it.

The app is sponsored by [BI Pixie](https://bipixie.com), AI Readiness for Power BI.

## Where the data comes from

The app reads static data files. `npm run snapshot` builds them from two public sources, and neither one needs a sign-in or a key:

- The Microsoft Marketplace catalog, for the visuals that are listed today.
- [`leaderboard_data.csv`](../leaderboard_data.csv) in this repository, for the history of each visual.

The files are written to `packages/frontend/public/snapshot`. They are built on every publish and are not committed.

## Getting the app without the visual files

This repository also holds every visual package, and a full clone downloads several gigabytes. The app needs none of those files, so the commands below download only the `app` folder and the few files at the top of the repository. They need Git 2.25 or later and finish in seconds.

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/DataChant/PowerBI-Visuals-Marketplace.git
cd PowerBI-Visuals-Marketplace
git sparse-checkout set app
```

`git pull` later brings only the changes to those same files.

## Running the app on your computer

You need Node.js 22 or 24.

```bash
cd app
npm ci
npm run snapshot
npm run dev:frontend
```

The app then opens at <http://localhost:5173>.

| Command | What it does |
| --- | --- |
| `npm run snapshot` | Builds the data files from the two public sources. |
| `npm run dev:frontend` | Starts the app on your computer. |
| `npm test` | Runs the tests. |
| `npm run lint` | Lints the app. |
| `npm run build:pages -- --base=/PowerBI-Visuals-Marketplace/` | Builds the site the way the GitHub Pages workflow does. The result is in `packages/frontend/dist`. |

## How the website is published

[`.github/workflows/pages.yml`](../.github/workflows/pages.yml) installs the dependencies, runs the type check, the lint and the tests, builds the data files and the site, and publishes the result to GitHub Pages. It runs after the daily refresh, when a change to `app/` reaches `main`, and on demand. On a pull request it builds and tests the site and publishes nothing.

## Publishing your own copy as a Fabric app

The app is built with [Rayfin](https://www.npmjs.com/package/@microsoft/rayfin-cli), so you can also publish your own copy as an app in Microsoft Fabric.

The repository holds no workspace ID, item ID or key, and there is nothing to fill in before you publish. The app reads only the data files that `npm run snapshot` builds, so it needs no semantic model and no connection of any kind. You choose the workspace when you publish.

### What you need

- Node.js 22 or 24.
- A Fabric workspace on a Fabric capacity, in which you can create items.

### Steps

1. Install the dependencies and build the data files.

   ```bash
   cd app
   npm ci
   npm run snapshot
   ```

2. Sign in to Fabric.

   ```bash
   npx rayfin login
   ```

3. Publish to your workspace. Replace the name with the name of your own workspace.

   ```bash
   npx rayfin up --workspace "My Fabric Workspace"
   ```

   `--workspace-id <id>` takes the workspace ID in place of the name. The ID is the part after `/groups/` in the address of the workspace in the Fabric portal. When neither option is given, Rayfin publishes to My Workspace.

`rayfin up` creates the app in that workspace and prints its address. It also writes `rayfin/.project.json`, `rayfin/.deployments.json` and `rayfin/.env`, which record where your copy lives. These files are yours and Git ignores them, so the next `npx rayfin up` updates the same app without the workspace option.

`npx rayfin up --workspace "My Fabric Workspace" --dry-run` checks the project and the workspace without publishing anything.

### Keeping your copy up to date

The data files are part of what is published. Running `npm run snapshot` and `npx rayfin up` again brings your copy up to date.

## Layout

| Path | What it holds |
| --- | --- |
| `packages/frontend` | The React app, built with Vite. |
| `packages/shared`, `packages/data` | The shared types and data definitions from the Rayfin app template. |
| `scripts/snapshot.mjs` | Builds the data files. |
| `rayfin/` | The Rayfin configuration for publishing to Fabric. |

## License

The app is released under the MIT license. See [LICENSE](LICENSE). It started from Microsoft's Rayfin app template, whose copyright notice the license keeps.
