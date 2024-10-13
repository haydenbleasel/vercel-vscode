import { formatDistance } from 'date-fns';
import { type Uri, workspace } from 'vscode';
import fetchDeployments from './fetchDeployments';
import parseError from './parseError';
import getVercelJson from './vercelJson';
import type { VercelProjectJson } from './vercelJson';

const app = workspace.getConfiguration('vercelVSCode');

export const getProjectPaths = async (): Promise<Uri[]> =>
  await workspace.findFiles('**/.vercel/project.json', '**/node_modules/**');

export const getProjectFiles = async (
  paths: Uri[]
): Promise<VercelProjectJson[]> =>
  Promise.all(
    paths.map(async (path) => {
      const file = await workspace.fs.readFile(path);
      const stringJson = Buffer.from(file).toString('utf8');

      return JSON.parse(stringJson) as VercelProjectJson;
    })
  );

export const getDeploymentStatus = async (
  projectFile: VercelProjectJson,
  accessToken: string
): Promise<string> => {
  try {
    const deployments = await fetchDeployments(
      accessToken,
      projectFile.projectId ?? '',
      projectFile.orgId ?? ''
    );

    if (!deployments?.length) {
      return 'No deployments found for this project.';
    }

    const { state, name, createdAt, source } = deployments[0];
    const formattedDate = createdAt
      ? formatDistance(new Date(createdAt), new Date())
      : 'a while';

    return [
      name ?? 'unknown repo',
      `(${state.toLowerCase()})`,
      `${formattedDate} ago`,
      'via',
      source ?? 'unknown source',
    ].join(' ');
  } catch (error) {
    return parseError(error);
  }
};

export const getProjectId = async (): Promise<string | undefined> => {
  const workspaceProjectId = app.get('projectId');

  if (typeof workspaceProjectId === 'string' && workspaceProjectId) {
    return workspaceProjectId;
  }

  const vercelJson = await getVercelJson();

  return vercelJson?.projectId;
};

export const getTeamId = async (): Promise<string | undefined> => {
  const workspaceTeamId = app.get('teamId');

  if (typeof workspaceTeamId === 'string' && workspaceTeamId) {
    return workspaceTeamId;
  }

  const vercelJson = await getVercelJson();

  return vercelJson?.orgId;
};

export const getAccessToken = (): string | undefined => app.get('accessToken');
