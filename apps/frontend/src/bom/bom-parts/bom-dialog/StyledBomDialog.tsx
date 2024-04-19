import { colors, overlay, transitions } from '../../../styles/variables';

import { Button } from '@orionsuite/shared-components';
import { Icons } from '../../../assets/icons/Icons';
import styled from 'styled-components';

interface DialogProps {
  dialogOpen: boolean;
}

const CustomTriggerButton = styled(Button)`
  background-color: ${colors.pink_2} !important;
  text-transform: none !important;
  width: 137px !important;
  height: 40px !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  column-gap: 10px;
  color: #fff !important;
  font-size: 14px !important;
  font-style: normal !important;
  font-weight: 500 !important;
  box-shadow: none !important;
  transition-property: background-color !important;
  transition-duration: 0.3s !important;
  transition-timing-function: ${transitions.bezier_hover} !important;
  border-radius: 6px !important;

  &:hover {
    background-color: #a956d0 !important;
    color: white !important;
  }
`;

const StyledArmchairWrapper = styled.div`
  display: flex;
  color: white;
  svg {
    width: 18px;
    height: 18px;
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
  StyledArmchairWrapper,
};
