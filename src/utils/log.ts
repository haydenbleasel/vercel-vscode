export const log = (...args: unknown[]): void => {
  // biome-ignore lint/suspicious/noConsoleLog: Logging
  // biome-ignore lint/suspicious/noConsole: Logging
  console.log('[vercel-vscode]', ...args);
};
