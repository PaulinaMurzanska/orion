import CustomInput from '../custom-input/CustomInput';
import { InputVariants } from '../custom-input/type';
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
  cell_variant?: InputVariants;
  disabled?: boolean;
}

const CustomEditableCell = <T extends object>({
  initialValue,
  editable,
  table,
  columnId,
  rowIndex,
  cell_variant,
  disabled,
}: Props<T>) => {
  const triggerOnRowUpdate = (val: any) => {
    if (table.options.meta?.updateData) {
      table.options.meta?.updateData(rowIndex, columnId, val);
    }
  };

  return (
    <CustomInput
      initialValue={initialValue}
      grabInputValue={triggerOnRowUpdate}
      variant={cell_variant}
      className="w-full bg-transparent hover:bg-transparent border-none"
      disabled={!editable || disabled}
    />
  );
};

export default CustomEditableCell;
