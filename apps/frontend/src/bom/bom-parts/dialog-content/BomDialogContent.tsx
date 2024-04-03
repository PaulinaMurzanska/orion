import {
  StyledCard,
  StyledContentWrapper,
  StyledDropActions,
  StyledDropArea,
} from './BomStyledDialogContent';

import DragDrop from './drag-drop-elements/DragDrop';
import { FileObjectType } from '../type';
import StatusZone from './drag-drop-elements/StatusZone';

const BomDialogContent = () => {
  const fileObjs: FileObjectType[] = [
    {
      id: 0,
      fileLoading: false,
      fileAdded: false,
      fileName: 'Drag and Drop',
      fullFileName: '',
      buttonText: 'Search for File',
      statusText: 'Your File Here',
      loaderText: '',
      fileContent: '',
      bomRecordID: null,
      bomRecordStatus: 1,
      fileJSON: {},
      file: null,
      itemLines: [],
    },
  ];

  return (
    <StyledContentWrapper>
      {fileObjs.map((obj) => (
        <StyledDropArea key={obj.id}>
          <StyledCard>
            <DragDrop fileObj={obj} />
          </StyledCard>
          <StyledCard>
            <StatusZone fileObj={obj} />
          </StyledCard>
        </StyledDropArea>
      ))}
      <StyledDropActions>actions </StyledDropActions>
    </StyledContentWrapper>
  );
};

export default BomDialogContent;
