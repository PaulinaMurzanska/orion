export function useConvertDataTypes() {
  const formatCurrency = (val: any) => {
    if (typeof val === 'number') {
      return val.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });
    } else if (val === null) {
      const nullable = 0;
      return nullable.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });
    } else {
      console.log('else');
      return 0;
    }
  };

  const formatToDollar = (val: any) => {
    let dolVal;
    let numericValue = val;
    if (typeof numericValue === 'string') {
      numericValue = parseFloat(val.replace(/[^0-9.-]/g, ''));
    }
    if (!isNaN(numericValue)) {
      dolVal = formatCurrency(numericValue);
    } else {
      dolVal = formatCurrency(0);
    }
    return dolVal;
  };

  const formatToPercent = (valueToConvert: any) => {
    const val = valueToConvert;
    let percentageVal;
    const floatValue = parseFloat(val);
    if (!isNaN(floatValue)) {
      percentageVal = floatValue.toLocaleString('en-US', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } else {
      const nullable = 0;
      percentageVal = nullable.toLocaleString('en-US', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return percentageVal;
  };

  const convertStringToNumber = (valueToConvert: any) => {
    if (typeof valueToConvert === 'string') {
      const cleanValue = valueToConvert.replace(/\$|,|%/g, '');
      let numberValue = parseFloat(cleanValue);
      if (!isNaN(numberValue)) {
        numberValue = parseFloat(numberValue.toFixed(2));
      }
      return numberValue;
    } else {
      return valueToConvert;
    }
  };

  return { formatToDollar, formatToPercent, convertStringToNumber };
}
