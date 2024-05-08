import { formatDistance } from 'date-fns';
import fetchDeployments from '@/utils/fetchDeployments';
import parseError from '@/utils/parseError';
import toSentenceCase from '@/utils/sentenceCase';
import { triangle } from './const';
import type { StatusBarItem } from 'vscode';

const updateStatus = async ({
  statusBarItem,
  accessToken,
  projectId,
  teamId,
}: {
  statusBarItem: StatusBarItem;
  accessToken: string;
  projectId: string;
  teamId?: string;
}): Promise<void> => {
  try {
    const deployments = await fetchDeployments(accessToken, projectId, teamId);

    if (!deployments?.length) {
      statusBarItem.text = `${triangle} No deployments`;
      statusBarItem.tooltip = 'No deployments found for this project.';
      return;
    }

    const { state, name, createdAt, source } = deployments[0];
    const formattedDate = createdAt
      ? formatDistance(new Date(createdAt), new Date())
      : 'a while';

    statusBarItem.text = `${triangle} ${toSentenceCase(state)}`;
    statusBarItem.tooltip = [
      name ?? 'unknown repo',
      `(${state.toLowerCase()})`,
      `${formattedDate} ago`,
      'via',
      source ?? 'unknown source',
    ].join(' ');
  } catch (error) {
    const message = parseError(error);

    statusBarItem.text = `${triangle} Error`;
    statusBarItem.tooltip = message;

    console.error(message);
  }
};

export default updateStatus;
