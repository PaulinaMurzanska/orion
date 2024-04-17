self.addEventListener('message', async (e) => {
  const { action, payload, defaultData, endpoint, method } = e.data;
  try {
    const response = await fetch(endpoint, {
      method: method || 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: method === 'GET' ? null : JSON.stringify(payload),
    });
    if (!response.ok) {
      const dataErr = await response.json();
      throw new Error(dataErr.error.message);
    }
    const data = await response.json();
    console.log('      data', data);
    postMessage({
      action,
      error: null,
      data,
      defaultData,
    });
  } catch (error: any) {
    const errResp = { error: true, err_message: error.message };
    console.error(error.message);
    postMessage({
      action,
      error: error.message,
      data: errResp,
      defaultData,
    });
  }
});
