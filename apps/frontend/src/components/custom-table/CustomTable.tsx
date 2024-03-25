import {
  EditableCell,
  IndeterminateCheckbox,
  Separator,
  Table,
} from '@orionsuite/shared-components';
import { Column, createColumnHelper } from '@tanstack/react-table';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
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
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 15px;
`;

const TableContainer = styled.div<{ width: number }>`
  height: 75vh;
  width: ${(props) => props.width}px;
`;

export function CustomTable<T extends object>({
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
            EditableCell({
              editable,
              initialValue: props.getValue() as any,
              table: props.table,
              rowIndex: props.row.index,
              columnId: column.id,
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
    <Container ref={containerRef}>
      <div className="flex justify-between mb-4">
        {header && header}
        {actions && <div className="flex gap-1 justify-end">{actions}</div>}
      </div>
      {filters && <div className="flex justify-between mb-4">{filters}</div>}

      <TableContainer width={containerWidth - 10}>
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

export default CustomTable;
