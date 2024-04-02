import { useEffect, useState } from 'react';

import { Table } from '@tanstack/table-core/src/types';

interface Props<T> {
  initialValue: string;
  editable?: boolean;
  table: Table<T> & {
    options: {
      meta?: {
        updateData?: {
          (rowIndex: number, columnId: string, value: string): void;
        };
      };
    };
  };
  rowIndex: number;
  columnId: string;
}

const EditableCell = <T extends object>({
  initialValue,
  editable,
  table,
  columnId,
  rowIndex,
}: Props<T>) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue);

  // When the input is blurred, we'll call our table meta's updateData function
  const onBlur = () => {
    if (table.options.meta?.updateData) {
      table.options.meta?.updateData(rowIndex, columnId, value);
    }
  };

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div style={{ width: 'max-content' }}>
      <input
        size={value.length + 3}
        disabled={!editable}
        className="w-full bg-transparent hover:bg-transparent border-none"
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
      />
    </div>
  );
};

export default EditableCell;
