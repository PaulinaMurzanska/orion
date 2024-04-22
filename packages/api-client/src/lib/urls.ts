export const getUrl = (
  deploy: string | number,  
  script: string | number,
  additionalParameters?: { id: string; value: string }[]
) => {
  let params = '';
  additionalParameters?.forEach((param) => {
    params += `&${param.id}=${param.value}`;
  });

  if (!deploy) {
    throw Error('deploy parameter is required');
  }

  if (!script) {
    throw Error('Script parameter is required');
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const baseUrl = import.meta.env.VITE_API_URL;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const compid = import.meta.env.VITE_API_COMPID;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const h = import.meta.env.VITE_API_H;

  return `${baseUrl}?script=${script}&deploy=${deploy}&compid=${compid}&h=${h}${params}`;
};

export const getExistingTransactionValueUrl = (transactionId: any) => {
  const url = `/app/site/hosting/scriptlet.nl?script=220&deploy=1&compid=TD2893635&h=2666e10fd32e93612036&scriptID=308&deploymentID=1&recordID=${transactionId}`;
  return url;
};

export const getUpdateExistingTransactionUrl = () => {
  const url = `/app/site/hosting/scriptlet.nl?script=220&deploy=1&compid=TD2893635&h=2666e10fd32e93612036&scriptID=307&deploymentID=1`;
  return url;
};
