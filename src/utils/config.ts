import { workspace } from 'vscode';
import getVercelJson from './vercelJson';

const app = workspace.getConfiguration('vercelVSCode');

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
