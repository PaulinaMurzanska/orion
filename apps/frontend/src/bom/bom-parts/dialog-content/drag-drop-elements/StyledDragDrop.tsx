import { Button, Card } from '@orionsuite/shared-components';
import { colors, shadows } from '../../../../styles/variables';
import styled, { css } from 'styled-components';

import Icon from '@mdi/react';
import { Icons } from '../../../../assets/icons/Icons';

interface DragDropProps {
  extension?: string | null;
  listHeader?: boolean;
  listItem?: boolean;
  listFooter?: boolean;
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

const StyledDragDrop = styled(Card)`
  position: relative;
  padding: 16px 16px 11px;
  border-radius: 12px;
  box-shadow: ${shadows.drop_shadow_black};
  width: 100%;
  border-radius: 12px;
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
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
  color: rgba(0, 0, 0, 0.87);
  white-space: pre;
  text-wrap: wrap;
  text-align: center;
  margin: 18px auto 0 !important;
  width: 80%;
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
  border-radius: 12px;
`;

const StyledDivider = styled.div`
  width: 100%;
  height: 2px;
  background-color: ${colors.grey_100};
  margin: 8px 0 0;
`;
const StyledDropZone = styled.div`
  position: relative;
  text-align: center;
  height: 100%;
`;

const StyledStatusCard = styled.div`
  width: 100%;
  height: 100%;
  padding: 9px 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 12px;
`;

const StyledListWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const StyledStatusList = styled.div`
  flex: 1;
  margin-top: 4px;
`;

const StyledRow = styled.div<DragDropProps>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid
    ${(props) =>
      props.listHeader
        ? colors.cyan_400
        : props.listItem
        ? colors.grey_090
        : 'none'};
  p {
    margin: 0 !important;
    color: #000;
    line-height: 1.4;
    font-size: 13px;
    font-weight: 400;

    ${(props) =>
      props.listHeader &&
      css`
        font-size: 13px;
      `}

    ${(props) =>
      props.listItem &&
      css`
        font-size: 11px;
      `}

    ${(props) =>
      props.listFooter &&
      css`
        font-weight: 700;
      `}
  }
`;

const StyledPackageIcon = styled(Icons.package)`
  width: 50px;
  height: 50px;
  color: ${colors.grey_400};
  margin: 10px auto;
`;

const StyledStatusZone = styled(Card)`
  height: 100%;
  position: relative;
  width: 100%;
  min-height: 137px;
  border-radius: 12px;
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
  StyledDropZone,
  StyledStatusCard,
  StyledStatusList,
  StyledListWrapper,
  StyledRow,
  StyledPackageIcon,
  StyledStatusZone,
};
