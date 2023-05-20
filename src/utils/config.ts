import { workspace } from 'vscode';

const app = 'vercelVSCode';

export const getProjectId = (): string | undefined =>
  workspace.getConfiguration(app).get('projectId');

export const getTeamId = (): string | undefined =>
  workspace.getConfiguration(app).get('teamId');

export const getAccessToken = (): string | undefined =>
  workspace.getConfiguration(app).get('accessToken');
