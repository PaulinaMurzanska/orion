import React, { useState } from 'react';

import { DatePicker } from '@orionsuite/shared-components';
import { format } from 'date-fns';

const DatepickerDemo = () => {
  const [dateIso, setDateIso] = useState<string>();
  const [dateUs, setDateUs] = useState<string>();

  const handleSetDate = (inputDate: Date) => {
    console.log('date', inputDate);
    let date = new Date(inputDate);
    let mmddyyyy = format(date, 'MM/dd/yyyy');
    let yyyymmdd = format(date, 'yyyy-MM-dd');
    setDateIso(yyyymmdd);
    setDateUs(mmddyyyy);
  };
  return (
    <div>
      <p className="text-green-700">date 'YYYY-MM-DD': {dateIso && dateIso}</p>
      <p className="text-green-700">date 'MM/DD/YYYY': {dateUs && dateUs}</p>
      <br />
      <DatePicker handleSetDate={handleSetDate} />
    </div>
  );
};

export { DatepickerDemo };
