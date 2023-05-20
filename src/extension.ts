import { StatusBarAlignment, window } from 'vscode';
import getProjectIdFromJson from '@/utils/parseJson';
import updateStatus from '@/utils/updateStatus';
import { getAccessToken, getProjectId, getTeamId } from './utils/config';
import toast from './utils/toast';
import { triangle } from './utils/const';

// eslint-disable-next-line no-undef
let interval: NodeJS.Timer | null = null;

export const activate = async (): Promise<void> => {
  const project = await getProjectIdFromJson();
  const projectId = project?.projectId ?? getProjectId();

  if (!projectId) {
    return;
  }

  const accessToken = getAccessToken();

  if (!accessToken) {
    toast
      .error('Please set your Vercel Access Token in the extension settings')
      .catch(toast.error);
    return;
  }

  const teamId = project?.teamId ?? getTeamId();

  const statusBarItem = window.createStatusBarItem(
    StatusBarAlignment.Right,
    100
  );

  statusBarItem.text = `${triangle} Loading`;
  statusBarItem.tooltip = 'Loading Vercel deployment status...';
  statusBarItem.show();

  await updateStatus({
    statusBarItem,
    accessToken,
    projectId,
    teamId,
  });

  interval = setInterval(async () => {
    await updateStatus({
      statusBarItem,
      accessToken,
      projectId,
      teamId,
    });
  }, 5000);
};

export const deactivate = (): void => {
  if (interval) {
    clearInterval(interval);
  }
};
