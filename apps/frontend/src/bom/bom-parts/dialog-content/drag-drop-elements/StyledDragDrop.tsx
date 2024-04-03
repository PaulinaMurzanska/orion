import { Button } from '@orionsuite/shared-components';
import Icon from '@mdi/react';
import styled from 'styled-components';

const StyledContentCentered = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledAttachment = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 2vh;
  color: white;
  background-color: #2db1ba;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const StyledAttachmentIcon = styled(Icon)`
  transform: scaleX(-1) scaleY(-1);
`;

const StyledDropButton = styled(Button)`
  margin-top: 20px;
  width: 100%;
  border-radius: 10px;
  text-transform: uppercase;
  font-size: 14px;
  letter-spacing: 0.5px;
  font-weight: 500;
`;

const StyledDragDrop = styled.div`
  font-family: 'Inter';
`;

const StyledDragTitle = styled.h2`
  font-weight: 700;
  font-size: 18px;
  line-height: 1;
  margin-bottom: 2px;
`;

const StyledDragTextSmall = styled.p`
  font-size: 14px;
  line-height: 20px;
  color: rgb(128, 128, 128);
`;

const StyledStatusZoneTextNormal = styled.p`
  font-size: 16px;
  line-height: 1;
  color: rgba(0, 0, 0, 0.87);
  white-space: pre;
`;

export {
  StyledAttachment,
  StyledAttachmentIcon,
  StyledDragDrop,
  StyledDragTextSmall,
  StyledDragTitle,
  StyledContentCentered,
  StyledDropButton,
  StyledStatusZoneTextNormal,
};
