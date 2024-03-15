import CustomCheckbox from '../../components/checkbox/CustomCheckbox';
import { useState } from 'react';

const CheckboxDemo = () => {
  const [checked, setChecked] = useState<boolean>();

  return (
    <div>
      <CustomCheckbox
        label="Home"
        onCheckedChange={(val: boolean) => setChecked(val)}
      />
      <br />
      <p className="text-sm font-medium text-green-700">
        Value returned: {checked ? 'TRUE' : 'FALSE'}
      </p>
    </div>
  );
};

export { CheckboxDemo };
