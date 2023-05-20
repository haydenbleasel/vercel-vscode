import { StatusBarAlignment, window } from 'vscode';
import { getAccessToken, getProjectId, getTeamId } from './utils/config';
import toast from './utils/toast';
import { triangle } from './utils/const';
import updateStatus from '@/utils/updateStatus';
import getProjectIdFromJson from '@/utils/vercelJson';

// eslint-disable-next-line no-undef
let interval: NodeJS.Timer | null = null;

export const activate = async (): Promise<void> => {
  const projectId = await getProjectId();

  if (!projectId) {
    return;
  }

  const accessToken = await getAccessToken();

  if (!accessToken) {
    toast
      .error('Please set your Vercel Access Token in the extension settings')
      .catch(toast.error);
    return;
  }

  const teamId = await getTeamId();

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
