import {
  StyledPackageIcon,
  StyledStatusZone,
  StyledStatusZoneTextNormal,
} from './StyledDragDrop';

import { FileObjectType } from '../../type';
import ProgressSpin from '../../../../components/progress-spin/ProgressSpin';
import StatusInfo from './StatusInfo';

interface StatusZoneProps {
  fileObj: FileObjectType;
}

const StatusZone = ({ fileObj }: StatusZoneProps) => {
  return (
    <StyledStatusZone>
      {fileObj.fileLoading && (
        <>
          <StyledStatusZoneTextNormal className="mb-5">
            {fileObj.loaderText}
          </StyledStatusZoneTextNormal>
          <ProgressSpin size={35} className="m-auto mt-3" />
        </>
      )}
      {!fileObj.fileLoading && !fileObj.fileAdded && (
        <StyledStatusZoneTextNormal className="mb-4">
          Files Are Not Selected
          <StyledPackageIcon />
        </StyledStatusZoneTextNormal>
      )}
      {!fileObj.fileLoading && fileObj.fileAdded && (
        <StatusInfo fileObj={fileObj} />
      )}
    </StyledStatusZone>
  );
};

export default StatusZone;
