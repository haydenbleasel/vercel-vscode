import { workspace } from 'vscode';
import getVercelJson from './vercelJson';

const app = 'vercelVSCode';

export const getProjectId = async (): Promise<string | undefined> => {
  const workspaceProjectId = workspace.getConfiguration(app).get('projectId');

  if (workspaceProjectId) {
    return workspaceProjectId as string;
  }

  const vercelJson = await getVercelJson();

  return vercelJson?.projectId;
};

export const getTeamId = async (): Promise<string | undefined> => {
  const workspaceTeamId = workspace.getConfiguration(app).get('teamId');

  if (workspaceTeamId) {
    return workspaceTeamId as string;
  }

  const vercelJson = await getVercelJson();

  return vercelJson?.teamId;
};

export const getAccessToken = async (): Promise<string | undefined> => {
  const workspaceAccessToken = workspace
    .getConfiguration(app)
    .get('accessToken');

  if (workspaceAccessToken) {
    return workspaceAccessToken as string;
  }

  const vercelJson = await getVercelJson();

  return vercelJson?.projectId;
};
