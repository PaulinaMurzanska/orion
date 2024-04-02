import { Button, Card, DialogContent } from '@orionsuite/shared-components';

import Icon from '@mdi/react';
import styled from 'styled-components';

//------------BOM Custom Dialog--------------------------//
const CustomDialogContent = styled(DialogContent)`
  border-radius: 2vh;
  background-color: rgb(211, 211, 211);
  width: 1000px;
  max-width: 1000px;
  min-height: 500px;
  padding: 30px 10px 0 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  row-gap: 20px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 11px 15px -7px,
    rgba(0, 0, 0, 0.14) 0px 24px 38px 3px, rgba(0, 0, 0, 0.12) 0px 9px 46px 8px;
`;

const CustomButton = styled(Button)`
  color: #1867c0;
  text-transform: uppercase;
  font-size: 14px;
  width: 100%;
  height: 52px;
  transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  &:hover {
    background-color: rgba(24, 103, 192, 0.05);
    color: #1867c0;
    transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;
const CustomTriggerButton = styled(Button)`
  background-color: rgb(24, 103, 192);
  color: #fff;
  text-transform: uppercase;
  font-size: 14px;
  letter-spacing: 1.25px;
  height: 36px;
  column-gap: 16px;
  border-radius: 4px;
  border: none;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px,
    rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
  transition-property: box-shadow, filter;
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    filter: brightness(1.2);
    background-color: rgb(24, 103, 170);
    color: white;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 8px -2px,
      rgba(0, 0, 0, 0.14) 0px 2px 8px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px;
  }
`;

const StyledInnerContent = styled.div`
  width: 100%;
  padding: 0px 10px 0 0;
  max-height: 500px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: inherit;
    padding-top: 30px;
  }

  &::-webkit-scrollbar-thumb {
    background: #302f2f;
    border-radius: 6px;
  }
`;

//------------BOM Dialog Content--------------------------//

const StyledContentWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: left;
  column-gap: 10px;
  row-gap: 10px;
`;

const StyledDropArea = styled.div`
  width: 200px;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  align-items: flex-start;
  cursor: move;
`;

const StyledDropActions = styled.div`
  min-width: 80px;
  margin-left: 10px;
  border: 1px solid grey;
  display: flex;
  flex-flow: column wrap;
`;

const StyledCard = styled(Card)`
  width: 100%;
  min-height: 200px;
  border-radius: 2vh;
  padding: 20px;
`;

const StyledContentCentered = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

//------------BOM Drag Drop--------------------------//

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

const StyledDragTextSmall = styled.h2`
  font-size: 14px;
  line-height: 1;
  color: rgb(128, 128, 128);
`;

export {
  CustomDialogContent,
  CustomButton,
  CustomTriggerButton,
  StyledInnerContent,
  StyledContentWrapper,
  StyledDropArea,
  StyledDropActions,
  StyledCard,
  StyledContentCentered,
  StyledAttachmentIcon,
  StyledDropButton,
  StyledDragDrop,
  StyledAttachment,
  StyledDragTextSmall,
  StyledDragTitle,
};
