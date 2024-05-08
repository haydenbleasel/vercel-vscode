/* eslint-disable require-atomic-updates */
import { StatusBarAlignment, window } from 'vscode';
import updateStatus from '@/utils/updateStatus';
import { getAccessToken, getProjectId, getTeamId } from './utils/config';
import { triangle } from './utils/const';

// eslint-disable-next-line no-undef
let interval: NodeJS.Timer | null = null;

export const activate = async (): Promise<void> => {
  const statusBarItem = window.createStatusBarItem(
    StatusBarAlignment.Right,
    100
  );

  statusBarItem.text = `${triangle} Loading Project`;
  statusBarItem.tooltip = 'Looking for Vercel project ID...';
  statusBarItem.show();

  const projectId = await getProjectId();

  console.log('Loaded Vercel Project ID', projectId);

  if (!projectId) {
    statusBarItem.text = `${triangle} Error`;
    statusBarItem.tooltip =
      'Vercel project ID not found. Please run `vercel link` in your project directory to link your project to Vercel.';
    return;
  }

  statusBarItem.text = `${triangle} Loading Token`;
  statusBarItem.tooltip = 'Looking for Vercel access token...';

  const accessToken = getAccessToken();

  console.log('Loaded Vercel Access Token', projectId);

  if (!accessToken) {
    statusBarItem.text = `${triangle} Error`;
    statusBarItem.tooltip =
      'Vercel access token not found. Please set your Vercel Access Token in the extension settings.';
    return;
  }

  statusBarItem.text = `${triangle} Loading Team ID`;
  statusBarItem.tooltip = 'Looking for Vercel team ID...';

  const teamId = await getTeamId();

  if (teamId) {
    console.log('Loaded Vercel Team ID', teamId);
  }

  statusBarItem.text = `${triangle} Loading`;
  statusBarItem.tooltip = 'Loading Vercel deployment status...';
  statusBarItem.show();

  const update = async () =>
    updateStatus({
      statusBarItem,
      accessToken,
      projectId,
      teamId,
    });

  await update();

  interval = setInterval(async () => {
    await update();
  }, 5000);
};

export const deactivate = (): void => {
  if (interval) {
    clearInterval(interval);
  }
};
