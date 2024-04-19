import { useEffect, useState } from 'react';

const getTransactionId = (queryId: string | null) => {
  let transactionId;
  let transactionExists;
  if (queryId === null) {
    const initialStringIdElement = document.getElementById(
      'created-string-id'
    ) as HTMLElement | null;
    if (initialStringIdElement) {
      const dataCreateId =
        initialStringIdElement.getAttribute('data-create-id');
      transactionId = dataCreateId;
    } else {
      console.warn('Element with ID "created-string-id" not found');
      transactionId = null;
    }
    transactionExists = false;
  } else {
    transactionId = queryId;
    transactionExists = true;
  }
  const idData = {
    transactionId,
    transactionExists,
  };
  return idData;
};

export { getTransactionId };
