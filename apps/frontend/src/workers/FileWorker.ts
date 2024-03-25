// fileWorker.js

import { json } from 'stream/consumers';

// TODO: create a specific worker for each different post/get format.
self.onmessage = function (e) {
  console.log('e', e);
  // Fetch enpoint data
  postToEndpoint(
    e.data.fileName,
    e.data.fileContent,
    e.data.endpoint,
    e.data.method
  );
};

// Function to post file name and body to the endpoint
const postToEndpoint = (
  fileName: string,
  fileContent: any,
  endpoint: string,
  method?: string
) => {
  const jsonBody = {
    fileName: fileName,
    fileContent: fileContent,
  };
  console.log('jsonBody', jsonBody);

  // Make a POST request to the endpoint
  fetch(endpoint, {
    method: method || 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: method === 'GET' ? null : JSON.stringify(jsonBody),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('data', data);
      // Send the response back to the main thread
      self.postMessage({ response: data });
    })
    .catch((error) => {
      console.error('Error:', error);
      // Send the error back to the main thread
      self.postMessage({ error: error.message });
    });
};

export const postToEndpoint2 = async (
  fileName: string,
  fileContent: any,
  endpoint: string,
  method?: string
) => {
  const jsonBody = {
    fileName: fileName,
    fileContent: fileContent,
    scriptID: 292,
    deploymentID: 1,
  };
  console.log('jsonBody', jsonBody);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      // method: method || 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: method === 'GET' ? null : JSON.stringify(jsonBody),
    });
    console.log('response', response);
    const data = await response.json();
    // const respData = JSON.parse(data.body);
    console.log('postToEndpoint2', data.output);
    return data;
    // const data = await json
  } catch (err) {
    console.error(err);
  }
};
