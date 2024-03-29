import { workspace, Uri } from 'vscode';
import parseError from '@/utils/parseError';
import toast from './toast';

export type VercelProjectJson = {
  projectId?: string;
  orgId?: string;
};

const getVercelJson = async (): Promise<VercelProjectJson | undefined> => {
  const root = workspace.workspaceFolders?.[0];

  console.log('Checking Vercel Project JSON from root', root?.uri.path);

  if (!root) {
    return undefined;
  }

  const filePath = `${root.uri.path}/.vercel/project.json`;
  const fileUri: Uri = Uri.file(filePath);

  let vercelProjectJson: Uint8Array | null = null;

  try {
    vercelProjectJson = await workspace.fs.readFile(fileUri);
  } catch {
    return undefined;
  }

  try {
    const stringJson: string = Buffer.from(vercelProjectJson).toString('utf8');
    const parsedVercelProjectJSON = JSON.parse(stringJson) as VercelProjectJson;
    return parsedVercelProjectJSON;
  } catch (error) {
    const message = parseError(error);
    await toast.error(message);
    return undefined;
  }
};

export default getVercelJson;
