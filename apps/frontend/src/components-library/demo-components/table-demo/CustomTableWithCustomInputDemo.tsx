import { Column, createColumnHelper } from '@tanstack/react-table';
import {
  IndeterminateCheckbox,
  Separator,
  Table,
} from '@orionsuite/shared-components';
import { ReactNode, useMemo } from 'react';

import CustomEditableCell from '../../../components/custom-table-cell/CustomEditableCell';
import styled from 'styled-components';

interface Props<T> {
  data: T[];
  columns: any[];
  onRowSelectionChange?: CallableFunction;
  onRowUpdate?: (rowIndex: number, columnId: string, value: T) => void;
  editable?: boolean;
  header: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  filters?: ReactNode;
  search?: string;
  setSearch?: (search: string) => void;
}

const Container = styled.div`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 15px;
`;

const TableContainer = styled.div`
  height: auto;
`;

export function CustomTableWithCustomInputDemo<T extends object>({
  data,
  columns,
  onRowSelectionChange,
  onRowUpdate,
  actions,
  editable,
  header,
  footer,
  filters,
  search,
  setSearch,
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
        columnHelper.accessor((row: T) => (row as any)[column.id], {
          id: column.id,
          enableGlobalFilter: true,
          enableColumnFilter: true,
          enableSorting: true,
          header: column.header,
          cell: (props) =>
            CustomEditableCell({
              editable,
              initialValue: props.getValue() as any,
              table: props.table,
              rowIndex: props.row.index,
              columnId: column.id,
              cell_variant: column.cell_variant,
              disabled: column.disabled,
            }),
        })
      ) as Column<T>[]),
    ];
  }, [columnHelper, columns, editable]);

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
          onRowUpdate={onRowUpdate}
          search={search}
          setSearch={setSearch}
        />
      </TableContainer>
      <Separator className="mt-5 mb-2" />
      {footer && <div className="flex">{footer}</div>}
    </Container>
  );
}

export default CustomTableWithCustomInputDemo;