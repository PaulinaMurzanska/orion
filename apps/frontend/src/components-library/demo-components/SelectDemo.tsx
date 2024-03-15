import {
  DashboardIcon,
  GearIcon,
  GlobeIcon,
  PersonIcon,
  StopwatchIcon,
} from '@radix-ui/react-icons';
import { useMemo, useState } from 'react';

import CustomSelect from '../../components/custom-select/CustomSelect';
import { SelectOptionType } from '../../components/custom-select/type';

const SelectDemo = () => {
  const selectOptions: SelectOptionType[] = useMemo(
    () => [
      {
        icon: <DashboardIcon />,
        value: 'gear',
        name: 'Dashboard',
        id: 1,
      },
      {
        icon: <GearIcon />,
        value: 'gear',
        name: 'Gear',
        id: 2,
      },
      {
        icon: <PersonIcon />,
        value: 'person',
        name: 'Person',
        id: 3,
      },
      {
        icon: <StopwatchIcon />,
        value: 'other1',
        name: 'Other value1',
        id: 4,
      },
      {
        icon: <GlobeIcon />,
        value: 'person',
        name: 'Other value2',
        id: 5,
      },
    ],
    []
  );
  const [selectedOption, setSelectedOption] = useState<
    SelectOptionType | undefined
  >();

  const getSelectedOption = (option: SelectOptionType) => {
    setSelectedOption(option);
  };
  return (
    <div>
      <CustomSelect
        options={selectOptions}
        getSelectedOption={getSelectedOption}
      />
      <div className="text-green-700">
        <p className="p-6 font-bold ">Value returned - selected option:</p>
        {selectedOption && (
          <div>
            <p className="flex gap-2">icon?: {selectedOption.icon}</p>
            <p className="flex gap-2">value?: {selectedOption.value}</p>
            <p className="flex gap-2">name: {selectedOption.name}</p>
            <p className="flex gap-2">id: {selectedOption.id}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export { SelectDemo };
