import { StatusBarAlignment, window } from 'vscode';
import {
  getAccessToken,
  getDeploymentStatus,
  getProjectFiles,
  getProjectPaths,
} from './utils/config';
import { triangle } from './utils/const';
import { log } from './utils/log';
import parseError from './utils/parseError';

let interval: NodeJS.Timer | null = null;

export const activate = async (): Promise<void> => {
  const statusBarItem = window.createStatusBarItem(
    StatusBarAlignment.Right,
    100
  );
  statusBarItem.text = `${triangle} Initializing`;
  statusBarItem.tooltip = 'Please wait...';
  statusBarItem.show();

  // Locate all `.vercel/project.json` project paths
  statusBarItem.text = `${triangle} Locating projects`;
  statusBarItem.tooltip = 'Looking for Vercel projects...';
  const projectPaths = await getProjectPaths();
  log('Located Vercel projects', projectPaths);

  if (!projectPaths.length) {
    statusBarItem.text = `${triangle} Error`;
    statusBarItem.tooltip =
      'No Vercel projects found. Please run `vercel link` in your project directory to link your project to Vercel.';
    return;
  }

  // Load all project files
  statusBarItem.text = `${triangle} Loading projects`;
  statusBarItem.tooltip = 'Loading Vercel projects...';
  const projectFiles = await getProjectFiles(projectPaths);
  log('Loaded Vercel project files', projectFiles);

  // Load access token
  statusBarItem.text = `${triangle} Loading Token`;
  statusBarItem.tooltip = 'Looking for Vercel access token...';
  const accessToken = getAccessToken();
  log('Loaded Vercel access token', accessToken);

  if (!accessToken) {
    statusBarItem.text = `${triangle} Error`;
    statusBarItem.tooltip =
      'Vercel access token not found. Please set your Vercel Access Token in the extension settings.';
    return;
  }

  // Load deployment statuses
  statusBarItem.text = `${triangle} Loading`;
  statusBarItem.tooltip = 'Loading Vercel deployment status...';
  statusBarItem.show();

  const update = async () => {
    try {
      const statuses: string[] = [];

      for (const projectFile of projectFiles) {
        const status = await getDeploymentStatus(projectFile, accessToken);

        statuses.push(status);
      }

      statusBarItem.text = `${triangle} Deployments`;
      statusBarItem.tooltip = statuses.join('\n');
    } catch (error) {
      statusBarItem.text = `${triangle} Error`;
      statusBarItem.tooltip = parseError(error);
    }
  };

  await update();

  interval = setInterval(async () => {
    await update();
  }, 5000);
};

export const deactivate = (): void => {
  if (interval) {
    clearInterval(interval as NodeJS.Timeout);
  }
};
