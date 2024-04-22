import {
  StyledListWrapper,
  StyledRow,
  StyledStatusCard,
  StyledStatusList,
} from './StyledDragDrop';

import { FileObjectType } from '../../type';

interface StatusZoneProps {
  fileObj: FileObjectType;
}

const StatusInfo = ({ fileObj }: StatusZoneProps) => {
  const tempList = [
    {
      name: 'Bom Record Id',
      value: fileObj.bomRecordID,
    },
    {
      name: 'File Id',
      value: fileObj.fileId,
    },
    {
      name: 'Record Local Id',
      value: fileObj.id,
    },
    {
      name: 'Imported lines',
      value: fileObj.itemLines?.length,
    },
    {
      name: 'Current Position',
      value: fileObj.currentPosition,
    },
    {
      name: 'Initial Position',
      value: fileObj.initialPosition,
    },
    {
      name: 'File Extension',
      value: fileObj.fileExtension,
    },
  ];
  return (
    <StyledStatusCard>
      <StyledListWrapper>
        <StyledRow listHeader={true}>
          <p>Uploaded File Data</p>
          <p></p>
        </StyledRow>
        <StyledStatusList>
          {tempList.map((item, i) => (
            <StyledRow key={i} className="" listItem={true}>
              <p>{item.name}</p>
              <p>{item.value}</p>
            </StyledRow>
          ))}
        </StyledStatusList>
      </StyledListWrapper>
      <StyledRow listFooter={true}>
        <p>Imported Lines</p>
        <p>{fileObj.itemLines?.length}</p>
      </StyledRow>
    </StyledStatusCard>
  );
};

export default StatusInfo;
