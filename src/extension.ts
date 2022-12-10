import { StatusBarAlignment, workspace, window, Uri } from 'vscode';
import { formatDistance } from 'date-fns';
import parseError from './utils/parseError';
import toSentenceCase from './utils/sentenceCase';
import fetchDeployments from './utils/fetchDeployments';

const getProjectIdFromJson = async (): Promise<string | undefined> => {
  if (!workspace.workspaceFolders?.[0]) {
    return undefined;
  }
  const wf = workspace.workspaceFolders[0].uri.path;
  const filePath = `${wf}/.vercel/project.json`;
  const fileUri: Uri = Uri.file(filePath);
  let vercelProjectJson: Uint8Array | null = null;
  try {
    vercelProjectJson = await workspace.fs.readFile(fileUri);
  } catch {
    await window.showErrorMessage('Could not find .vercel/project.json file.');
    return undefined;
  }
  try {
    const stringJson: string = Buffer.from(vercelProjectJson).toString('utf8');
    const parsedVercelJSON: { projectId?: string } = JSON.parse(stringJson) as {
      projectId?: string;
    };
    return parsedVercelJSON.projectId;
  } catch (error) {
    await window.showErrorMessage(parseError(error));
    return undefined;
  }
};

// eslint-disable-next-line no-undef
let interval: NodeJS.Timer | null = null;

export const activate = async (): Promise<void> => {
  const access_token = workspace
    .getConfiguration('vercel-vscode')
    .get('access_token');

  if (!access_token || typeof access_token !== 'string') {
    await window.showErrorMessage(
      'Please set your Vercel access token in the extension settings.'
    );
    return;
  }
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
  const statusBarItem = window.createStatusBarItem(
    StatusBarAlignment.Right,
    100
  );

  statusBarItem.text = `$(debug-breakpoint-function-unverified) Loading`;
  statusBarItem.tooltip = 'Loading Vercel deployment status...';
  statusBarItem.show();

  const updateStatus = async () => {
    try {
      // This CAN'T be undefined, but eslint seems to disagree.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const deployments = await fetchDeployments(project!, access_token);

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
