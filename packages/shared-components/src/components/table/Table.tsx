import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  RowModel,
  Table as TableType,
  TableState,
  Updater,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './TableComponents';

interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
}

const Table = <T extends object>(props: TableProps<T>) => {
  const { data, columns } = props;

  const table = useReactTable({
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    renderFallbackValue: undefined,
    state: {},
  });

  return (
    <ShadcnTable className="w-full">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                colSpan={header.colSpan}
                onClick={() => header.column.getToggleSortingHandler()}
              >
                <div
                  {...{
                    className: header.column.getCanSort()
                      ? 'cursor-pointer select-none'
                      : '',
                    onClick: header.column.getToggleSortingHandler(),
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{
                    // asc: sortIcon(true),
                    // desc: sortIcon(false),
                  }[header.column.getIsSorted() as string] ?? null}
                </div>
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody className="w-full">
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
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