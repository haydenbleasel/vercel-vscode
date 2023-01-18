import { StatusBarAlignment, workspace, window } from 'vscode';
import getProjectIdFromJson from '@/utils/parseJson';
import updateStatus from '@/utils/updateStatus';

// eslint-disable-next-line no-undef
let interval: NodeJS.Timer | null = null;

export const activate = async (): Promise<void> => {
  let project: string | undefined = workspace
    .getConfiguration('vercel-vscode')
    .get('project');

  if (!project || typeof project !== 'string') {
    // eslint-disable-next-line require-atomic-updates
    project = await getProjectIdFromJson();
  }

  if (!project || typeof project !== 'string') {
    return;
  }

  const access_token = workspace
    .getConfiguration('vercel-vscode')
    .get('access_token');

  if (!access_token || typeof access_token !== 'string') {
    await window.showErrorMessage(
      'Please set your Vercel access token in the extension settings.'
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

  await updateStatus({ statusBarItem, project, access_token });

  interval = setInterval(async () => {
    await updateStatus({
      statusBarItem,
      project: project as unknown as string,
      access_token,
    });
  }, 5000);
};

export const deactivate = (): void => {
  if (interval) {
    clearInterval(interval);
  }
};
