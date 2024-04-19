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
import { useCallback, useMemo, useState } from 'react';

interface Props<T> {
  selectedRows: T[];
}

const SidebarContent = <T extends RowObject>({ selectedRows }: Props<T>) => {
  const [currentRow, setCurrentRow] = useState<number>(0);

  const values = useMemo(() => {
    return Object.values(selectedRows[currentRow] || {});
  }, [currentRow, selectedRows]);

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

  return (
    <div>
      <div className="text-xl font-semibold">
        {selectedRows.length} Item Selected - Line {selectedRows[currentRow]?.line} Item {selectedRows[currentRow]?.id}
      </div>
      <div style={{ color: '#64748B' }}>
        Edit one or more items in this page
      </div>
      <div className="flex justify-between my-4">
        <Button>Individual Edit</Button>
        <Button variant="secondary">Bulk Edit</Button>
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
      <div
        className="flex flex-wrap gap-3 overflow-scroll"
      >
        {values.map((value) => (
          <div className="flex flex-col">
            <div className="font-semibold">Label</div>
            <Input value={value} size={18} />
          </div>
        ))}
      </div>
      <Separator className="my-4" />
      <div className="flex justify-between">
        <div>{selectedRows.length} elements affected</div>
        <div className="flex">
          <Button variant="ghost">Cancel</Button>
          <Button variant="secondary"> Submit</Button>
        </div>
      </div>
    </div>
  );
};

export default SidebarContent;
