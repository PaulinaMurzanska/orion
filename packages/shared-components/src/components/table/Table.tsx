import {
  ColumnDef,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  RowModel,
  Table as TableType,
  TableState,
  Updater,
  useReactTable,
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';

import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './TableComponents';
import { useState, useEffect, useCallback, useRef } from 'react';
import ColumnMenu from './ColumnMenu';
import { getCommonPinningStyles } from './styles';
import { rankItem } from '@tanstack/match-sorter-utils';

interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onRowSelectionChange?: CallableFunction;
  onRowUpdate?: (rowIndex: number, columnId: string, value: T) => void;
  search?: string;
  setSearch?: (search: string) => void;
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

const Table = <T extends object>(props: TableProps<T>) => {
  const {
    data,
    columns,
    onRowSelectionChange,
    onRowUpdate,
    search,
    setSearch,
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
    debugTable: true,
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
    <ShadcnTable>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                colSpan={header.colSpan}
                onClick={() => header.column.getToggleSortingHandler()}
                style={{ ...getCommonPinningStyles(header.column) }}
              >
                <div
                  {...{
                    className: header.column.getCanSort()
                      ? 'flex justify-between items-center cursor-pointer select-none'
                      : '',
                    onClick: header.column.getToggleSortingHandler(),
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{
                    asc: '▲',
                    desc: '▼',
                  }[header.column.getIsSorted() as string] ?? null}

                  {header.column.id !== 'checkbox' && (
                    <ColumnMenu column={header.column} />
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
                style={{ ...getCommonPinningStyles<T>(cell.column) }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </ShadcnTable>
  );
};
export default Table;
