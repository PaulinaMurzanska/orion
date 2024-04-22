import { CSS } from '@dnd-kit/utilities';
import DragDrop from './DragDrop';
import { FileObjectType } from '../../type';
import { RootState } from 'apps/frontend/store';
import StatusZone from './StatusZone';
import { StyledDropArea } from './StyledDragDrop';
import { useSelector } from 'react-redux';
import { useSortable } from '@dnd-kit/sortable';

interface Props {
  fileObjects: FileObjectType[];
  file: FileObjectType;
  onDropFunction: (dropzoneId: string, file: any) => void;
}

const DropAndStatusArea = ({ fileObjects, file, onDropFunction }: Props) => {
  const disableDragDrop = useSelector(
    (state: RootState) => state.bom.disableDragDrop
  );

  const id = file.id;
  const { attributes, listeners, transform, transition, setNodeRef } =
    useSortable({ id, disabled: disableDragDrop });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <StyledDropArea
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      id={id}
    >
      <DragDrop fileObj={file} onDropFunction={onDropFunction} />
      <StatusZone fileObj={file} />
    </StyledDropArea>
  );
};

export default DropAndStatusArea;
