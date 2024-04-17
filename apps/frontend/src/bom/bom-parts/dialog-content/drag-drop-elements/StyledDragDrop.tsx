import { Button, Card } from '@orionsuite/shared-components';

import Icon from '@mdi/react';
import styled from 'styled-components';

interface DragDropProps {
  extension?: string | null;
}

const StyledContentCentered = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledAttachment = styled.div<DragDropProps>`
  width: 100px;
  height: 100px;
  border-radius: 2vh;
  color: white;
  background-color: ${(props) =>
    props.extension === '' ? '#2db1ba' : 'rgb(45, 186, 135)'};
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
  position: relative;
`;

const StyledDragTitle = styled.h2`
  margin: 0 !important;
  font-weight: 700;
  font-size: 18px;
  line-height: 1;
  margin-bottom: 2px;
`;

const StyledDragTextSmall = styled.p`
  margin: 0 !important;
  font-size: 14px;
  line-height: 20px;
  color: rgb(128, 128, 128);
`;

const StyledStatusZoneTextNormal = styled.p`
  font-size: 16px;
  line-height: 1;
  color: rgba(0, 0, 0, 0.87);
  white-space: pre;
  text-wrap: wrap;
  text-align: center;
`;

const StyledDropArea = styled.div`
  width: 200px;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  align-items: flex-start;
  cursor: move;
  position: relative;
`;

const StyledCard = styled(Card)`
  width: 100%;
  min-height: 200px;
  border-radius: 2vh;
  padding: 20px;
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
  StyledDropArea,
  StyledCard,
};
