import { StatusBarAlignment, workspace, window } from 'vscode';
import getProjectIdFromJson from '@/utils/parseJson';
import updateStatus from '@/utils/updateStatus';

// eslint-disable-next-line no-undef
let interval: NodeJS.Timer | null = null;

export const activate = async (): Promise<void> => {
  const project = await getProjectIdFromJson();

  const projectId: string | undefined = project?.projectId
    ? project.projectId
    : workspace.getConfiguration('vercelVSCode').get('projectId');

  if (!projectId) {
    return;
  }

  const accessToken: string | undefined = workspace
    .getConfiguration('vercelVSCode')
    .get('accessToken');

  if (!accessToken) {
    await window.showErrorMessage(
      'Please set your Vercel Access Token in the extension settings'
    );
    return;
  }

  const teamId: string | undefined = project?.teamId
    ? project.teamId
    : workspace.getConfiguration('vercelVSCode').get('teamId');

  const statusBarItem = window.createStatusBarItem(
    StatusBarAlignment.Right,
    100
  );

  statusBarItem.text = `$(debug-breakpoint-function-unverified) Loading`;
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
      teamId: project?.teamId,
    });
  }, 5000);
};

export const deactivate = (): void => {
  if (interval) {
    clearInterval(interval);
  }
};
