import { StatusBarAlignment, window } from 'vscode';
import updateStatus from '@/utils/updateStatus';
import { getAccessToken, getProjectId, getTeamId } from './utils/config';
import toast from './utils/toast';
import { triangle } from './utils/const';

// eslint-disable-next-line no-undef
let interval: NodeJS.Timer | null = null;

export const activate = async (): Promise<void> => {
  const projectId = await getProjectId();

  console.log('Loaded Vercel Project ID', projectId);

  if (!projectId) {
    return;
  }

  const accessToken = getAccessToken();

  console.log('Loaded Vercel Access Token', projectId);

  if (!accessToken) {
    await toast.error(
      'Please set your Vercel Access Token in the extension settings'
    );
    return;
  }

  const teamId = await getTeamId();

  if (teamId) {
    console.log('Loaded Vercel Team ID', teamId);
  }

  const statusBarItem = window.createStatusBarItem(
    StatusBarAlignment.Right,
    100
  );

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
