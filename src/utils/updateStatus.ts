import { formatDistance } from 'date-fns';
import type { StatusBarItem } from 'vscode';
import { window } from 'vscode';
import fetchDeployments from '@/utils/fetchDeployments';
import parseError from '@/utils/parseError';
import toSentenceCase from '@/utils/sentenceCase';

const updateStatus = async ({
  statusBarItem,
  project,
  access_token,
}: {
  statusBarItem: StatusBarItem;
  project: string;
  access_token: string;
}): Promise<void> => {
  try {
    const deployments = await fetchDeployments(project, access_token);

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

export default updateStatus;
