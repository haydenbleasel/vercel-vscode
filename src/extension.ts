import type { ExtensionContext } from 'vscode';
import { StatusBarAlignment, workspace, window } from 'vscode';
import fetch from 'cross-fetch';
import { formatDistance } from 'date-fns';
import parseError from './utils/parseError';

const toSentenceCase = (str: string): string => {
  let newString = str.toLowerCase();

  newString = newString.charAt(0).toUpperCase() + newString.slice(1);

  return newString;
};

// eslint-disable-next-line no-undef
let interval: NodeJS.Timer | null = null;

export const activate = async (context: ExtensionContext): Promise<void> => {
  const access_token = workspace
    .getConfiguration('vercel-vscode')
    .get('access_token');
  const project = workspace.getConfiguration('vercel-vscode').get('project');

  if (!access_token || typeof access_token !== 'string') {
    await window.showErrorMessage(
      'Please set your Vercel access token in the extension settings.'
    );
    return;
  }

  if (!project || typeof project !== 'string') {
    await window.showErrorMessage(
      'Please set your Vercel project name in the extension settings.'
    );
    return;
  }

  const statusBarItem = window.createStatusBarItem(
    StatusBarAlignment.Right,
    100
  );

  statusBarItem.text = `$(debug-breakpoint-function-unverified) Loading`;
  statusBarItem.tooltip = 'Loading Vercel deployment status...';
  statusBarItem.show();

  const updateStatus = async () => {
    try {
      const response = await fetch(
        `https://api.vercel.com/v6/deployments?projectId=${project}&limit=1`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      const data = (await response.json()) as {
        error?: Error;
        deployments?: {
          source?: string;
          name?: string;
          createdAt?: string;
          state:
            | 'BUILDING'
            | 'ERROR'
            | 'INITIALIZING'
            | 'QUEUED'
            | 'READY'
            | 'CANCELED';
        }[];
      };

      if (data.error) {
        throw new Error(data.error.message);
      }

      if (!data.deployments?.length) {
        return;
      }

      const { state, name, createdAt, source } = data.deployments[0];
      const formattedDate = createdAt
        ? formatDistance(new Date(createdAt), new Date())
        : 'a while';

      statusBarItem.text = `$(debug-breakpoint-function-unverified) ${toSentenceCase(
        state
      )}`;
      statusBarItem.tooltip = `${
        name ?? 'unknown repo'
      } (${state.toLowerCase()}) ${formattedDate} ago via ${
        source ?? 'unknown source'
      }`;
    } catch (error) {
      const message = parseError(error);

      await window.showErrorMessage(message);
    }
  };

  await updateStatus();

  interval = setInterval(async () => {
    await updateStatus();
  }, 5000);
};

export const deactivate = (): void => {
  if (interval) {
    clearInterval(interval);
  }
};
