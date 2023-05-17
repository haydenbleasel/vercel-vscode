import fetch from 'cross-fetch';

type VercelResponse = {
  error?: Error;
  deployments?: {
    source?: string;
    name?: string;
    createdAt?: string;
    state:
      | 'BUILDING'
      | 'ERROR'
      | 'INITIALIZING'
      | 'QUEUED'
      | 'READY'
      | 'CANCELED';
  }[];
};

const fetchDeployments = async (
  accessToken: string,
  projectId: string,
  teamId?: string
): Promise<VercelResponse['deployments']> => {
  const response = await fetch(
    teamId
      ? `https://api.vercel.com/v6/deployments?teamId=${teamId}&projectId=${projectId}&limit=1`
      : `https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=1`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = (await response.json()) as VercelResponse;

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.deployments;
};

export default fetchDeployments;
