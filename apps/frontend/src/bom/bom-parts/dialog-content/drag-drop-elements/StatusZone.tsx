import {
  StyledContentCentered,
  StyledStatusZoneTextNormal,
} from './StyledDragDrop';

import { FileObjectType } from '../../type';
import ProgressSpin from '../../../../components/progress-spin/ProgressSpin';

interface StatusZoneProps {
  fileObj: FileObjectType;
}

const StatusZone = ({ fileObj }: StatusZoneProps) => {
  return (
    <StyledContentCentered>
      <StyledStatusZoneTextNormal className="mb-4">
        {fileObj.loaderText}
      </StyledStatusZoneTextNormal>
      {fileObj.fileLoading && <ProgressSpin size={35} />}
    </StyledContentCentered>
  );
};

export default StatusZone;
