import {
  IndeterminateCheckbox,
  RowObject,
  Table,
} from '@orionsuite/shared-components';
import { Column, createColumnHelper } from '@tanstack/react-table';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { DragEndEvent } from '@dnd-kit/core';
import CustomEditableCell from '../custom-table-cell/CustomEditableCell';
import TableSidebar from './sidebar/TableSidebar';
import { motion } from 'framer-motion';

interface Props<T> {
  data: T[];
  columns: any[];
  onRowSelectionChange?: CallableFunction;
  onRowDragEnd?: (event: DragEndEvent) => void;
  onRowUpdate?: (rowIndex: number, columnId: string, value: T) => void;
  selectedRows?: T[];
  editable?: boolean;
  isLoading?: boolean;
  header: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  filters?: ReactNode;
  search?: string;
  setSearch?: (search: string) => void;
}

const Container = styled.div`
`;

const Footer = styled.div`
  background: #2b2b2e;
  border-radius: 8px;
  display: flex;
  align-items: center;
  width: 100%;
  color: white;
  padding: 10px;
  gap: 5px;
  margin: 10px 0 0 0;
`;

export function CustomTable<T extends RowObject>({
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
  onRowDragEnd,
  selectedRows,
}: Props<T>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const columnHelper = createColumnHelper<T>();

  const columnDef = useMemo(() => {
    const checkbox = {
      id: 'checkbox',
      size: 1,
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

    const drag = {
      id: 'row-drag',
      size: 1,
      cell: () => <div>=</div>,
    };

    return [
      drag,
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
              externalValue: props.getValue() as any,
              table: props.table,
              rowIndex: props.row.index,
              columnId: column.id,
              cellVariant: column.cellVariant,
              disabled: column.disabled,
            }),
        })
      ) as Column<T>[]),
    ];
  }, [columnHelper, columns, editable]);

  return (
    <div className="flex">
      <div className="flex flex-col">
        <Container>
          <div className="flex justify-between mb-4">
            {header && header}
            {actions && <div className="flex gap-1 justify-end">{actions}</div>}
          </div>
          {filters && (
            <div className="flex justify-between mb-4">{filters}</div>
          )}

          <motion.div
            style={{ position: 'sticky' }}
            animate={{
              width: sidebarOpen
                ? 'calc(100vw - 575px)'
                : 'calc(100vw - 175px)',
              height: 'calc(100vh - 225px)',
            }}
          >
            <Table
              onRowDragEnd={onRowDragEnd}
              data={data}
              columns={columnDef}
              onRowSelectionChange={onRowSelectionChange}
              onRowUpdate={onRowUpdate}
              search={search}
              setSearch={setSearch}
              editable={editable}
            />
          </motion.div>
        </Container>
        {footer && <Footer>{footer}</Footer>}
      </div>
      <TableSidebar<T>
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        selectedRows={selectedRows}
      />
    </div>
  );
}

export default CustomTable;
