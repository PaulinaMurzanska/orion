const summarizeData = (
  combinedDataArr: Array<object>,
  summaryProps: Array<string>
) => {
  const summarizedData: { [key: string]: any } = {};
  for (const data of combinedDataArr) {
    for (const prop of summaryProps) {
      summarizedData[prop] = (summarizedData[prop] || 0) + Number(data[prop]);
    }
  }
  return summarizedData;
};

const insertSummaryIntoNetsuite = (data: any, newLine?: boolean) => {
  if (import.meta.env.MODE === 'production') {

    const summaryData = summarizeData(data, [
      'quantity',
      'porate',
      'rate',
    ]);

    require(['N/currentRecord'], (currentRecord: { get: () => any }) => {
      const recordObj = currentRecord.get();
      const lineCount = recordObj.getLineCount({
        sublistId: 'item',
      });
      let poRate, rate;

      if (lineCount === 1 && !newLine) {
        const oldRate = recordObj.getSublistValue({
          sublistId: 'item',
          fieldId: 'rate',
          line: 0,
        });
        const oldPORate = recordObj.getSublistValue({
          sublistId: 'item',
          fieldId: 'porate',
          line: 0,
        });
        rate = Math.abs(summaryData.rate) + Number(oldRate);
        poRate = Math.abs(summaryData.porate) + Number(oldPORate);
        recordObj.selectLine({
          sublistId: 'item',
          line: 0,
        });
      } else {
        recordObj.selectNewLine({
          sublistId: 'item',
        });
        rate = Math.abs(summaryData.rate);
        poRate = Math.abs(summaryData.porate);
      }
      recordObj.setCurrentSublistValue({
        sublistId: 'item',
        fieldId: 'item',
        value: 44,
        forceSyncSourcing: true,
      });
      recordObj.setCurrentSublistValue({
        sublistId: 'item',
        fieldId: 'quantity',
        value: 1,
        forceSyncSourcing: true,
      });
      recordObj.setCurrentSublistValue({
        sublistId: 'item',
        fieldId: 'description',
        value: 'Total',
        forceSyncSourcing: true,
      });
      recordObj.setCurrentSublistValue({
        sublistId: 'item',
        fieldId: 'rate',
        value: rate.toFixed(2),
        forceSyncSourcing: true,
      });
      recordObj.setCurrentSublistValue({
        sublistId: 'item',
        fieldId: 'porate',
        value: poRate.toFixed(2),
        forceSyncSourcing: true,
      });
      recordObj.commitLine({
        sublistId: 'item',
      });
    });
  }
};

export default { insertSummaryIntoNetsuite };
