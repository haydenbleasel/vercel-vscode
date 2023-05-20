# Vercel for VS Code

A VS Code extension for Vercel deployment status.

![Screenshot](./screenshot.png)

## Usage

1. Install the extension from the [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=haydenbleasel.vercel-vscode) or with the terminal command `code --install-extension haydenbleasel.vercel-vscode`.
2. Open the extension settings and enter your API token (recommended to put this in your user settings so it is not shared with others).
3. Add your Vercel Project ID and/or Team ID to your workspace. This can be done in one of two ways (see below).
4. Reload VSCode to apply the changes and start using the extension.

## Settings Properties

### Vercel Project ID

Your Vercel Project ID can be found in the Vercel dashboard under `Settings > General > Project ID`.

### (Optional) Vercel Team ID

If you are working on a project that is part of a team, you will also need your team ID to access the API. Your Vercel Team ID can be found in the Vercel dashboard under `{TEAM} > Settings > General > Team ID`.

## Configuration

#### Using VSCode settings (Recommended)

You can create a `.vscode/settings.json` file in your project and add the following:

```json
{
  "vercel-vscode.projectId": "prj_myProjectID",
  "vercel-vscode.teamId": "team_myTeamID",
  "vercel-vscode.accessToken": "myAccessToken"
}
```

### Using .vercel/project.json

You can add your Vercel Project ID and/or Team Id to this file by adding the following:

```json
{
  "projectId": "prj_myProjectID",
  "teamId": "team_myTeamID"
}
```

## Development

0. Ensure you have the latest version of [Node.js](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/) installed.
1. Clone the repo.
2. Run `yarn install` to install dependencies.
3. Run `yarn dev` to compile the extension and watch for changes.
4. Open the folder in VS Code.
5. Launch a new VSCode window with the extension loaded. You can either press `F5` or open the command palette and run `Debug: Start Debugging`.
6. Make changes to the extension and reload the extension to see them take effect.
