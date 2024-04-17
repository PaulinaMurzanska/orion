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

interface Props<T> {
  data: T[];
  columns: any[];
  onRowSelectionChange?: CallableFunction;
  onRowDragEnd?: (event: DragEndEvent) => void;
  onRowUpdate?: (rowIndex: number, columnId: string, value: T) => void;
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
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 15px;
`;

const TableContainer = styled.div<{ width: number }>`
  position: sticky;
  height: 78vh;
  width: calc(100vw - 150px);
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
}: Props<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
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

  // Resize table to allow horizontal scrolling
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((event) => {
      setContainerWidth(event[0].contentBoxSize[0].inlineSize);
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <>
      <Container ref={containerRef}>
        <div className="flex justify-between mb-4">
          {header && header}
          {actions && <div className="flex gap-1 justify-end">{actions}</div>}
        </div>
        {filters && <div className="flex justify-between mb-4">{filters}</div>}

        <TableContainer width={containerWidth}>
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
        </TableContainer>
      </Container>
      {footer && <Footer>{footer}</Footer>}
    </>
  );
}

export default CustomTable;
