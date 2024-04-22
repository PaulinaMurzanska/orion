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
  const { fileLoading, fileAdded, createArrayProgress, arrayCreated } = fileObj;
  return (
    <StyledStatusZone>
      {!fileLoading && !fileAdded && (
        <StyledStatusZoneTextNormal className="mb-4">
          Files Are Not Selected
          <StyledPackageIcon />
        </StyledStatusZoneTextNormal>
      )}

      {fileLoading && (
        <>
          <StyledStatusZoneTextNormal className="mb-5">
            {fileObj.loaderText}
          </StyledStatusZoneTextNormal>
          <ProgressSpin size={35} className="m-auto mt-3" />
        </>
      )}
      {!fileLoading && fileAdded && !createArrayProgress && !arrayCreated && (
        <StatusInfo fileObj={fileObj} />
      )}
      {!fileLoading && fileAdded && !createArrayProgress && arrayCreated && (
        <>
          <StyledStatusZoneTextNormal className="mb-5">
            {fileObj.loaderText}
          </StyledStatusZoneTextNormal>
          <div className="flex items-center justify-center ">
            <p className="text-xs text-center">Your can close the dialog now</p>
          </div>
        </>
      )}
    </StyledStatusZone>
  );
};

export default StatusZone;
