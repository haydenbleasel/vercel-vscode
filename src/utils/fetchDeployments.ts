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
  project: string,
  access_token: string
): Promise<VercelResponse['deployments']> => {
  const response = await fetch(
    `https://api.vercel.com/v6/deployments?projectId=${project}&limit=1`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
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
