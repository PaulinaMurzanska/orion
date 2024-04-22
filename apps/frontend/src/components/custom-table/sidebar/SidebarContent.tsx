import {
  Button,
  Input,
  RowObject,
  Separator,
} from '@orionsuite/shared-components';
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  ArrowUpDownIcon,
  ArrowUpNarrowWide,
  DiffIcon,
  ListChecksIcon,
  PlusIcon,
} from 'lucide-react';
import CloseIcon from 'mdi-react/CloseIcon';
import ChevronDownUpIcon from 'mdi-react/ChevronDownUpIcon';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import {
  removeRecordById,
  updateRecord,
} from '../../../views/records/recordsSlice';

interface Props<T> {
  selectedRows: T[];
}

enum EditMode {
  INDIVIDUAL,
  BULK,
}

const SidebarContent = <T extends RowObject>({ selectedRows }: Props<T>) => {
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState<EditMode>(EditMode.INDIVIDUAL);

  const { columns } = useSelector((state: RootState) => state.recordsSlice);
  const [currentRow, setCurrentRow] = useState<number>(0);
  const [currentRecord, setCurrentRecord] = useState<any>(
    selectedRows[currentRow]
  );

  const values = useMemo(() => {
    return columns.map((col) => ({
      id: col.id,
      label: col.label,
      value: currentRecord?.[col.id],
    }));
  }, [columns, currentRecord]);

  const next = useCallback(() => {
    if (currentRow === selectedRows.length - 1) {
      return;
    }
    setCurrentRow((row) => row + 1);
  }, [currentRow, selectedRows.length]);

  const prev = useCallback(() => {
    if (currentRow === 0) {
      return;
    }
    setCurrentRow((row) => row - 1);
  }, [currentRow]);

  const onSave = useCallback(() => {
    if (editMode === EditMode.BULK) {
      selectedRows.forEach((row) => {
        const newRow = { ...row };
        columns.forEach((col) => {
          (newRow as any)[col.id] = currentRecord[col.id];
        });

        dispatch(updateRecord(newRow));
      });
    } else {
      dispatch(updateRecord(currentRecord));
    }
  }, [currentRecord, dispatch, editMode, selectedRows]);

  const onRowUpdate = useCallback(
    (columnId: string, value: string) => {
      const tmp = { ...currentRecord };
      tmp[columnId] = value;
      setCurrentRecord(tmp);
    },
    [currentRecord]
  );

  useEffect(() => {
    setCurrentRecord(selectedRows[currentRow]);
  }, [currentRow, selectedRows]);

  return (
    <div>
      <div className="text-xl font-semibold">
        {selectedRows.length} Item Selected - Line{' '}
        {selectedRows[currentRow]?.line} Item {selectedRows[currentRow]?.id}
      </div>
      <div style={{ color: '#64748B' }}>
        Edit one or more items in this page
      </div>
      <div className="flex justify-between my-4">
        <Button
          onClick={() => setEditMode(EditMode.INDIVIDUAL)}
          variant={editMode === EditMode.INDIVIDUAL ? 'default' : 'secondary'}
        >
          Individual Edit
        </Button>
        <Button
          onClick={() => setEditMode(EditMode.BULK)}
          variant={editMode === EditMode.BULK ? 'default' : 'secondary'}
        >
          Bulk Edit
        </Button>
        <Button variant="secondary" disabled={currentRow === 0} onClick={prev}>
          {'<'}
        </Button>
        <Button
          variant="secondary"
          disabled={currentRow === selectedRows.length - 1}
          onClick={next}
        >
          {'>'}
        </Button>
      </div>
      <div className="flex justify-between mt-3">
        <PlusIcon
          style={{ marginTop: 'auto', cursor: 'pointer' }}
          size={24}
        ></PlusIcon>
        <CloseIcon size={24} className="cursor-pointer" />
        <DiffIcon size={24} className="cursor-pointer" />
        <ArrowUpDownIcon size={24} className="cursor-pointer" />
        <ChevronDownUpIcon size={24} className="cursor-pointer" />
        <ArrowRightToLine size={24} className="cursor-pointer" />
        <ArrowLeftToLine size={24} className="cursor-pointer" />
        <ListChecksIcon size={24} className="cursor-pointer" />
        <ArrowUpNarrowWide
          size={24}
          style={{ transform: 'rotate(180deg)', cursor: 'pointer' }}
        />
      </div>
      <Separator className="my-2" />
      <div className="flex flex-wrap gap-3 overflow-scroll">
        {values.map((value) => (
          <div className="flex flex-col" key={value.id}>
            <div className="font-semibold">{value.label}</div>
            <Input
              value={value.value}
              size={18}
              onChange={(e) => onRowUpdate(value.id, e.target.value)}
            />
          </div>
        ))}
      </div>
      <Separator className="my-4" />
      <div className="flex justify-between">
        <div>
          {editMode === EditMode.INDIVIDUAL ? 1 : selectedRows.length} elements
          affected
        </div>
        <div className="flex">
          <Button variant="ghost">Cancel</Button>
          <Button variant="secondary" onClick={onSave}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SidebarContent;
