import { TableCell } from './TableComponents';
import { getCommonPinningStyles } from './styles';
import { flexRender } from '@tanstack/react-table';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Row as RowType } from '@tanstack/react-table';
import { TableRow as Row } from './TableComponents';
import { CSSProperties } from 'react';
import { RowObject } from './types';

interface Props<T> {
  row: RowType<T>;
  editable?: boolean;
  setSidebarOpen: (open: boolean) => void;
  setSidebarRow: (row: T) => void;
}

const TableRow = <T extends RowObject>({
  row,
  setSidebarRow,
  setSidebarOpen,
  editable,
}: Props<T>) => {
  const {
    transform,
    transition,
    setNodeRef,
    isDragging,
    attributes,
    listeners,
  } = useSortable({
    id: row.original.id,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
  };

  const rowProps = editable
    ? {}
    : {
        className: 'cursor-pointer',
        onClick: () => {
          setSidebarOpen(true);
          setSidebarRow(row.original);
        },
      };

  return (
    <Row {...rowProps} style={style} ref={setNodeRef}>
      {row.getVisibleCells().map((cell) => {
        const cellProps =
          cell.column.id === 'row-drag' && editable
            ? { ...{ ...listeners, ...attributes } }
            : {};

        return (
          <TableCell
            {...cellProps}
            key={cell.id}
            style={{ ...getCommonPinningStyles<T>(cell.column) }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        );
      })}
    </Row>
  );
};

export default TableRow;
