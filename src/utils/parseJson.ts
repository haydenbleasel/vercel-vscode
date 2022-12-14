import { workspace, window, Uri } from 'vscode';
import parseError from './parseError';

const getProjectIdFromJson = async (): Promise<string | undefined> => {
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
    const parsedVercelJSON: { projectId?: string } = JSON.parse(stringJson) as {
      projectId?: string;
    };
    return parsedVercelJSON.projectId;
  } catch (error) {
    const message = parseError(error);
    await window.showErrorMessage(message);
    return undefined;
  }
};

export default getProjectIdFromJson;
