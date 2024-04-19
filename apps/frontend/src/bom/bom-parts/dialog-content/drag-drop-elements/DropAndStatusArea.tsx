import { CSS } from '@dnd-kit/utilities';
import DragDrop from './DragDrop';
import { FileObjectType } from '../../type';
import StatusZone from './StatusZone';
import { StyledDropArea } from './StyledDragDrop';
import { useSortable } from '@dnd-kit/sortable';

interface Props {
  fileObjects: FileObjectType[];
  file: FileObjectType;
  onDropFunction: (dropzoneId: string, file: any) => void;
}

const DropAndStatusArea = ({ fileObjects, file, onDropFunction }: Props) => {
  const id = file.id;

  const { attributes, listeners, transform, transition, setNodeRef } =
    useSortable({ id, disabled: false });

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
