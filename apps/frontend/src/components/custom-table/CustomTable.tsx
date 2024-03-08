import { Table } from '@orionsuite/shared-components';
import { Column, createColumnHelper } from '@tanstack/react-table';

interface Props<T> {
  data: T[];
  columns: any[];
}

export function CustomTable<T extends object>({ data, columns }: Props<T>) {
  const columnHelper = createColumnHelper<T>();

  const columnDef = columns.map((column) =>
    columnHelper.accessor((row) => row, {
      id: column.id,
      header: column.header,
      cell: (props) => (props.getValue() as any)[column.id],
    })
  ) as Column<T>[];

  return <Table data={data} columns={columnDef} />;
}

export default CustomTable;
