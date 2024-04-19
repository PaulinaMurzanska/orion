import {
  ColumnDef,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table as ShadcnTable,
  TableBody,
  TableHead,
  TableHeader,
  TableRow as ShadcnRow,
} from './TableComponents';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import ColumnMenu from './ColumnMenu';
import { getCommonPinningStyles } from './styles';
import { rankItem } from '@tanstack/match-sorter-utils';
import TableRow from './TableRow';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { RowObject } from './types';
import { ArrowDownIcon, ArrowUpIcon } from '@radix-ui/react-icons';

interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onRowSelectionChange?: CallableFunction;
  onRowUpdate?: (rowIndex: number, columnId: string, value: T) => void;
  onRowDragEnd?: (event: DragEndEvent) => void;
  search?: string;
  setSearch?: (search: string) => void;
  editable?: boolean;
}

function useSkipper() {
  const shouldSkipRef = useRef(true);
  const shouldSkip = shouldSkipRef.current;

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = useCallback(() => {
    shouldSkipRef.current = false;
  }, []);

  useEffect(() => {
    shouldSkipRef.current = true;
  });

  return [shouldSkip, skip] as const;
}

const Table = <T extends RowObject>(props: TableProps<T>) => {
  const {
    data,
    columns,
    onRowSelectionChange,
    onRowUpdate,
    search,
    setSearch,
    editable,
    onRowDragEnd,
  } = props;
  const [rowSelection, setRowSelection] = useState({});
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const fuzzyFilter: FilterFn<T> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({
      itemRank,
    });
    return itemRank.passed;
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const dataIds = useMemo(() => data?.map(({ id }: T) => id), [data]);

  const table = useReactTable({
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,

    renderFallbackValue: undefined,
    enableGlobalFilter: true,
    enableColumnFilters: true,
    onGlobalFilterChange: setSearch,
    globalFilterFn: fuzzyFilter,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      rowSelection,
      globalFilter: search,
    },
    autoResetPageIndex,
    // debugTable: true,
    meta: {
      updateData: (rowIndex: number, columnId: string, value: T) => {
        // Skip page index reset until after next rerender
        skipAutoResetPageIndex();
        if (onRowUpdate) {
          onRowUpdate(rowIndex, columnId, value);
        }
      },
    },
  });

  useEffect(() => {
    if (onRowSelectionChange) {
      onRowSelectionChange(
        table.getSelectedRowModel().flatRows.map((row) => row.original)
      );
    }
  }, [table, rowSelection]);

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={onRowDragEnd}
      sensors={sensors}
    >
      <ShadcnTable>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <ShadcnRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  onClick={() => header.column.getToggleSortingHandler()}
                  style={{ ...getCommonPinningStyles(header.column) }}
                >
                  <div
                    style={{
                      background: header.column.getIsSorted() ? '#F1F5F9' : '',
                      borderRadius: '4px',
                      padding: header.column.getIsSorted() ? '8px' : '',
                    }}
                    {...{
                      className: header.column.getCanSort()
                        ? `flex items-center cursor-pointer select-none gap-2`
                        : '',
                      onClick: header.column.getToggleSortingHandler(),
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: <ArrowUpIcon />,
                      desc: <ArrowDownIcon />,
                    }[header.column.getIsSorted() as string] ?? null}

                    {!['checkbox', 'row-drag'].includes(header.column.id) && (
                      <ColumnMenu column={header.column} />
                    )}
                  </div>
                </TableHead>
              ))}
            </ShadcnRow>
          ))}
        </TableHeader>
        <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
          <TableBody>
            {table.getRowModel().rows.map((row, index) => (
              <TableRow
                index={index}
                row={row}
                key={row.original.id}
                editable={editable}
              />
            ))}
          </TableBody>
        </SortableContext>
      </ShadcnTable>
    </DndContext>
  );
};
export default Table;
