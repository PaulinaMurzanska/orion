import { useSortable } from '@dnd-kit/sortable';
import { RowObject } from './types';

const RowDrag = ({ id }: RowObject) => {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <button {...attributes} {...listeners}>
      ==
    </button>
  );
};

export default RowDrag;
