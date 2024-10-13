import { formatDistance } from 'date-fns';
import { type Uri, workspace } from 'vscode';
import { z } from 'zod';
import fetchDeployments from './fetchDeployments';
import parseError from './parseError';

const vercelSchema = z.object({
  projectId: z.string(),
  orgId: z.string(),
});

type VercelProjectJson = z.infer<typeof vercelSchema>;

export const getProjectPaths = async (): Promise<Uri[]> =>
  await workspace.findFiles('**/.vercel/project.json', '**/node_modules/**');

export const getProjectFiles = async (
  paths: Uri[]
): Promise<VercelProjectJson[]> =>
  Promise.all(
    paths.map(async (path) => {
      const file = await workspace.fs.readFile(path);
      const stringJson = Buffer.from(file).toString('utf8');
      const json = JSON.parse(stringJson);
      const parsed = vercelSchema.parse(json);

      return parsed;
    })
  );

export const getDeploymentStatus = async (
  projectFile: VercelProjectJson,
  accessToken: string
): Promise<string> => {
  try {
    const deployments = await fetchDeployments(
      accessToken,
      projectFile.projectId,
      projectFile.orgId
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

export const getAccessToken = (): string | undefined =>
  workspace.getConfiguration('vercelVSCode').get('accessToken');
