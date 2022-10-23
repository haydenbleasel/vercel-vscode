# Vercel for VS Code

A VS Code extension for Vercel deployment status.

![Screenshot](./screenshot.png);

## Usage

1. Install the extension from the [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=haydenbleasel.vercel-vscode) or with the terminal command `code --install-extension haydenbleasel.vercel-vscode`.
2. Open the extension settings and enter your API token.
3. Create a `.vscode/settings.json` file in your project and add the following:

```json
{
  "vercel-vscode.project": "prj_myproject"
}
```

4. Reload VSCode to apply the changes and start using the extension.
