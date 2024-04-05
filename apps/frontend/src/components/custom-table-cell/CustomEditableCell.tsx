import CustomInput from '../custom-input/CustomInput';
import { InputVariants } from '../custom-input/type';
import { Table } from '@tanstack/table-core/src/types';

interface Props<T> {
  externalValue: string;
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
  cellVariant?: InputVariants;
  disabled?: boolean;
}

const CustomEditableCell = <T extends object>({
  externalValue,
  editable,
  table,
  columnId,
  rowIndex,
  cellVariant,
  disabled,
}: Props<T>) => {
  const triggerOnRowUpdate = (val: any) => {
    if (table.options.meta?.updateData) {
      table.options.meta?.updateData(rowIndex, columnId, val);
    }
  };

  return (
    <CustomInput
      externalValue={externalValue}
      grabInputValue={triggerOnRowUpdate}
      variant={cellVariant}
      className="w-full bg-transparent hover:bg-transparent border-none"
      disabled={!editable || disabled}
    />
  );
};

export default CustomEditableCell;
