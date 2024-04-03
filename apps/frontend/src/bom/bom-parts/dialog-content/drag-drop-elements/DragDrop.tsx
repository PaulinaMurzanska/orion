import {
  StyledAttachment,
  StyledAttachmentIcon,
  StyledContentCentered,
  StyledDragDrop,
  StyledDragTextSmall,
  StyledDragTitle,
  StyledDropButton,
} from './StyledDragDrop';

import { FileObjectType } from '../../type';
import { mdiAttachment } from '@mdi/js';

interface DragProps {
  fileObj: FileObjectType;
}

const DragDrop = ({ fileObj }: DragProps) => {
  return (
    <StyledDragDrop>
      <StyledContentCentered>
        <StyledAttachment>
          <StyledAttachmentIcon path={mdiAttachment} size={2.5} />
        </StyledAttachment>
        <StyledDragTitle className="font-bold text-lg m-0 leading-none">
          {fileObj.fileName}
        </StyledDragTitle>
        <StyledDragTextSmall>{fileObj.statusText}</StyledDragTextSmall>
        <StyledDropButton>{fileObj.buttonText}</StyledDropButton>
      </StyledContentCentered>
    </StyledDragDrop>
  );
};

export default DragDrop;
