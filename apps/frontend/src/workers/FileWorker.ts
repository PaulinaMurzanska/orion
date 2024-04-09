// fileWorker.js

import { json } from 'stream/consumers';

// TODO: create a specific worker for each different post/get format.
self.onmessage = function (e) {
  console.log('e', e);
  // Fetch enpoint data
  postToEndpoint(e.data.jsonBody);
};

// Function to post file name and body to the endpoint
const postToEndpoint = (jsonBody: any) => {
  console.log('jsonBody', jsonBody);

  const endpoint = jsonBody.endpoint;

  // Make a POST request to the endpoint
  fetch(endpoint, {
    method: jsonBody.method || 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: jsonBody.method === 'GET' ? null : JSON.stringify(jsonBody),
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

export const handleHttpRequest = async (
  payload: any,
  endpoint: string,
  method?: string
) => {
  const jsonBody = payload;
  let responseData;
  try {
    const response = await fetch(endpoint, {
      method: method || 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: method === 'GET' ? null : JSON.stringify(jsonBody),
    });
    if (!response.ok) {
      const dataErr = await response.json();
      throw new Error(dataErr.error.message);
    }
    const data = await response.json();
    console.log('      data', data);
    responseData = data;
  } catch (error: any) {
    const errResp = { error: true, err_message: error.message };
    responseData = errResp;
    console.error(error.message);
  }
  return responseData;
};
