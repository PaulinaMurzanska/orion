import { colors, overlay, transitions } from '../../../styles/variables';

import { Button } from '@orionsuite/shared-components';
import { Icons } from '../../../assets/icons/Icons';
import styled from 'styled-components';

interface DialogProps {
  dialogOpen: boolean;
}

const CustomTriggerButton = styled(Button)`
  background-color: rgb(24, 103, 192) !important;
  color: #fff !important;
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
    filter: brightness(1.2) !important;
    background-color: rgb(24, 103, 170) !important;
    color: white !important;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 8px -2px,
      rgba(0, 0, 0, 0.14) 0px 2px 8px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px;
  }
`;

const StyledInnerContent = styled.div`
  width: 100%;
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

const StyledDialog = styled.div``;

const StyledContentWrapper = styled.div`
  border-radius: 20px;
  background-color: rgb(211, 211, 211);
  width: 95%;
  max-width: 1950px;
  min-height: 380px;
  padding: 26px 40px 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  row-gap: 12px;
  position: relative;
`;

const StyledDialogOpen = styled.div<DialogProps>`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  background-color: ${overlay.black_50};
  z-index: 200;
  opacity: ${(props) => (props.dialogOpen ? '1' : '0')};
  background-color: ${(props) => (props.dialogOpen ? overlay.black_50 : '')};
  pointer-events: ${(props) => (props.dialogOpen ? 'auto' : 'none')};
  visibility: ${(props) => (props.dialogOpen ? 'visible' : 'hidden')};
  transition: all 0.3s ease-out;
`;

const StyledEmail = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  column-gap: 10px;
  font-size: 12px;
  font-weight: 400;
  span {
    text-decoration: underline;
  }
`;

const StyledCloseIcon = styled(Icons.closeX)`
  position: absolute;
  top: 16px;
  right: 16px;
  color: ${colors.dark_blue};
  width: 32px;
  height: 32px;
  cursor: pointer;
  transition: ${transitions.bezier_hover};
  &:hover {
    color: ${colors.blue_primary_hover};
  }
`;

export {
  CustomTriggerButton,
  StyledInnerContent,
  StyledDialog,
  StyledContentWrapper,
  StyledDialogOpen,
  StyledEmail,
  StyledCloseIcon,
};
