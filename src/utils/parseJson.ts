import { workspace, window, Uri } from 'vscode';
import parseError from '@/utils/parseError';
import toast from './toast';

export type VercelProjectJson = {
  projectId?: string;
  teamId?: string;
};

const getProjectIdFromJson = async (): Promise<
  VercelProjectJson | undefined
> => {
  if (!workspace.workspaceFolders?.[0]) {
    return undefined;
  }

  const { path } = workspace.workspaceFolders[0].uri;
  const filePath = `${path}/.vercel/project.json`;
  const fileUri: Uri = Uri.file(filePath);

  let vercelProjectJson: Uint8Array | null = null;

  try {
    vercelProjectJson = await workspace.fs.readFile(fileUri);
  } catch {
    return undefined;
  }

  try {
    const stringJson: string = Buffer.from(vercelProjectJson).toString('utf8');
    const parsedVercelProjectJSON: { projectId?: string } = JSON.parse(
      stringJson
    ) as VercelProjectJson;
    return parsedVercelProjectJSON;
  } catch (error) {
    const message = parseError(error);
    await toast.error(message);
    return undefined;
  }
};

export default getProjectIdFromJson;
