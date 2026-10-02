# Custom Visuals Marketplace

Custom Visuals Marketplace is a web app that ranks and explores the Power BI visuals on Microsoft Marketplace. It shows a leaderboard, a replay of how the ranking changed over time, ratings, popularity, and the words publishers use to describe their visuals. Each visual opens a profile with its screenshots, its history and a link to download its pbiviz file.

The app is published at <https://datachant.github.io/PowerBI-Visuals-AppSource/> and is rebuilt after every daily refresh of this repository. Nobody needs to sign in to use it.

The app is sponsored by [BI Pixie](https://bipixie.com), AI Readiness for Power BI.

## Where the data comes from

The app reads static data files. `npm run snapshot` builds them from two public sources, and neither one needs a sign-in or a key:

- The Microsoft Marketplace catalog, for the visuals that are listed today.
- [`leaderboard_data.csv`](../leaderboard_data.csv) in this repository, for the history of each visual.

The files are written to `packages/frontend/public/snapshot`. They are built on every publish and are not committed.

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
| `npm run build:pages -- --base=/PowerBI-Visuals-AppSource/` | Builds the site the way the GitHub Pages workflow does. The result is in `packages/frontend/dist`. |

## How the website is published

[`.github/workflows/pages.yml`](../.github/workflows/pages.yml) installs the dependencies, runs the type check, the lint and the tests, builds the data files and the site, and publishes the result to GitHub Pages. It runs after the daily refresh, when a change to `app/` reaches `main`, and on demand. On a pull request it builds and tests the site and publishes nothing.

## Publishing your own copy as a Fabric app

The app is built with [Rayfin](https://www.npmjs.com/package/@microsoft/rayfin-cli), so you can also publish your own copy as an app in Microsoft Fabric. You need a Fabric workspace that you can create items in.

```bash
cd app
npm ci
npm run snapshot
npx rayfin login
npx rayfin up
```

`rayfin up` asks which workspace to use, publishes the app there, and prints its address. The data files are part of what is published, so running `npm run snapshot` and `npx rayfin up` again brings your copy up to date.

`rayfin/rayfin.yml` still declares a semantic model connector named `visuals`, with its workspace and item IDs set to zeros. The app does not query a semantic model, so the connector is not needed. Before you publish, you can remove it with `npx rayfin connector remove visuals`, or point it at a semantic model of your own.

## Layout

| Path | What it holds |
| --- | --- |
| `packages/frontend` | The React app, built with Vite. |
| `packages/shared`, `packages/data` | The shared types and data definitions from the Rayfin app template. |
| `scripts/snapshot.mjs` | Builds the data files. |
| `rayfin/` | The Rayfin configuration for publishing to Fabric. |

## License

The app is released under the MIT license. See [LICENSE](LICENSE). It started from Microsoft's Rayfin app template, whose copyright notice the license keeps.
