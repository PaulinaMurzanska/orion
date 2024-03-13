import {
  Button,
  IndeterminateCheckbox,
  Separator,
  Table,
} from '@orionsuite/shared-components';
import { Column, createColumnHelper, RowModel } from '@tanstack/react-table';
import styled from 'styled-components';
import { ReactNode, useMemo } from 'react';

interface Props<T> {
  data: T[];
  columns: any[];
  onRowSelectionChange?: CallableFunction;
  header: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  filters?: ReactNode;
}

const Container = styled.div`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 15px;
`;

const TableContainer = styled.div`
  height: 600px;
`;

export function CustomTable<T extends object>({
  data,
  columns,
  onRowSelectionChange,
  actions,
  header,
  footer,
  filters,
}: Props<T>) {
  const columnHelper = createColumnHelper<T>();
  const columnDef = useMemo(() => {
    const checkbox = {
      id: 'checkbox',
      header: ({ table }: any) => (
        <IndeterminateCheckbox
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />
      ),
      cell: ({ row }: any) => (
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      ),
    };

    return [
      checkbox,
      ...(columns.map((column) =>
        columnHelper.accessor((row) => row, {
          id: column.id,
          header: column.header,
          cell: (props) => (props.getValue() as any)[column.id],
        })
      ) as Column<T>[]),
    ];
  }, [columnHelper, columns]);

  return (
    <Container>
      <div className="flex justify-between mb-4">
        {header && header}
        {actions && <div className="flex gap-1 justify-end">{actions}</div>}
      </div>
      {filters && <div className="flex justify-between mb-4">{filters}</div>}
      <TableContainer>
        <Table
          data={data}
          columns={columnDef}
          onRowSelectionChange={onRowSelectionChange}
        />
      </TableContainer>
      <Separator className="mt-5 mb-2" />
      {footer && <div className="flex">{footer}</div>}
    </Container>
  );
}

export default CustomTable;
