import { StyledCard, StyledDropArea } from './StyledDragDrop';

import { CSS } from '@dnd-kit/utilities';
import DragDrop from './DragDrop';
import { FileObjectType } from '../../type';
import StatusZone from './StatusZone';
import { useSortable } from '@dnd-kit/sortable';

interface Props {
  fileObjects: FileObjectType[];
  file: FileObjectType;
  handleDeleteDropZone: (id: string | number) => void;
  onDropFunction: (dropzoneId: string, file: any) => void;
}

const DropAndStatusArea = ({
  fileObjects,
  file,
  handleDeleteDropZone,
  onDropFunction,
}: Props) => {
  const id = file.id;

  const { attributes, listeners, transform, transition, setNodeRef } =
    useSortable({ id });

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
      <StyledCard>
        <DragDrop fileObj={file} onDropFunction={onDropFunction} />
      </StyledCard>
      <StyledCard>
        <StatusZone fileObj={file} />
      </StyledCard>
    </StyledDropArea>
  );
};

export default DropAndStatusArea;
