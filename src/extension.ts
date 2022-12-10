import { StatusBarAlignment, workspace, window } from 'vscode';
import { formatDistance } from 'date-fns';
import parseError from './utils/parseError';
import toSentenceCase from './utils/sentenceCase';
import fetchDeployments from './utils/fetchDeployments';

// eslint-disable-next-line no-undef
let interval: NodeJS.Timer | null = null;

export const activate = async (): Promise<void> => {
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
      const deployments = await fetchDeployments(project, access_token);

      if (!deployments?.length) {
        return;
      }

      const { state, name, createdAt, source } = deployments[0];
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
