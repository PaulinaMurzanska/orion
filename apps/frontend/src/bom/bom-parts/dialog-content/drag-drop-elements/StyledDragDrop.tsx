import { Button, Card } from '@orionsuite/shared-components';
import { colors, shadows } from '../../../../styles/variables';

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
  width: 64px;
  height: 64px;
  border-radius: 8px;
  color: white;
  background-color: ${colors.grey_700};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  p {
    font-size: 20px;
    margin: 0;
  }
`;

const StyledAttachmentIcon = styled(Icon)`
  transform: scaleX(-1) scaleY(-1);
  width: 37px;
`;

const StyledDropButton = styled(Button)`
  width: 100%;
  font-weight: 700;
  padding: 12px 24px;
  font-size: 12px;
  background-color: ${colors.blue_primary};
  margin-top: 8px;
  box-shadow: ${shadows.drop_shadow_black};
  &:hover {
    background-color: ${colors.blue_primary_hover};
  }
`;

const StyledDragDrop = styled.div`
  position: relative;
  padding: 16px 16px 11px;
`;

const StyledDragTitle = styled.h2`
  margin: 0 !important;
  font-weight: 700;
  font-size: 16px;
  line-height: 1.4;
  margin-bottom: 2px;
  color: ${colors.dark_blue};
`;

const StyledDragTextSmall = styled.p`
  margin: 0 !important;
  font-size: 12px;
  line-height: 1.4;
  color: rgb(128, 128, 128);
  height: 17px;
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
  width: 196px;
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
  border-radius: 12px;
  box-shadow: ${shadows.drop_shadow_black};
`;

const StyledDivider = styled.div`
  width: 100%;
  height: 2px;
  background-color: ${colors.grey_100};
  margin: 8px 0 0;
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
  StyledDivider,
};
