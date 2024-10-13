# Vercel for VS Code

A VS Code extension for Vercel deployment status.

![Screenshot](./screenshot.png)

## Prerequisites

To setup this extension, you'll need the following:

1. VS Code, version 1.72.0 or above.
2. A Vercel Token, which you can create in your [Vercel account settings](https://vercel.com/account/tokens).
3. A Vercel Project ID, which you can find in your Vercel project under the "General" tab.
4. Optionally a Vercel Team ID, which you can find in your Vercel team settings under the "General" tab.

## Installation

You can install the extension from the [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=haydenbleasel.vercel-vscode) or with the terminal command:

```sh
code --install-extension haydenbleasel.vercel-vscode
```

## Configuration

1. Open the extension settings and enter your token. **It's recommended to put this in your User Settings (not Workspace Settings) so it is not shared with others**.
2. In your terminal, run `vercel link`. This will create a file at `.vercel/project.json` with your Project and Team ID.
3. Reload VSCode to apply the changes and start using the extension.

## Development

1. Ensure you have the latest version of [Node.js](https://nodejs.org/en/) and [yarn](https://yarnpkg.com/) installed.
2. Clone the repo.
3. Run `yarn install` to install dependencies.
4. Run `yarn dev` to compile the extension and watch for changes.
5. Open the folder in VS Code.
6. Launch a new VSCode window with the extension loaded. You can either press `F5` or open the command palette and run `Debug: Start Debugging`.
7. Make changes to the extension and reload the extension to see them take effect.
