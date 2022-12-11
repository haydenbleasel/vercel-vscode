# Vercel for VS Code

A VS Code extension for Vercel deployment status.

![Screenshot](./screenshot.png);

## Usage

1. Install the extension from the [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=haydenbleasel.vercel-vscode) or with the terminal command `code --install-extension haydenbleasel.vercel-vscode`.
2. Open the extension settings and enter your API token.
3. Open a workspace which uses the Vercel CLI(and has a .vercel/project.json), or create a `.vscode/settings.json` file in your project and add the following:

```json
{
  "vercel-vscode.project": "prj_myprojectID"
}
```

4. Reload VSCode to apply the changes and start using the extension.

## Development

0. Ensure you have the latest version of [Node.js](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/) installed.
1. Clone the repo.
2. Run `yarn install` to install dependencies.
3. Run `yarn dev` to compile the extension and watch for changes.
4. Open the folder in VS Code.
5. Launch a new VSCode window with the extension loaded. You can either press `F5` or open the command palette and run `Debug: Start Debugging`.
6. Make changes to the extension and reload the extension to see them take effect.
