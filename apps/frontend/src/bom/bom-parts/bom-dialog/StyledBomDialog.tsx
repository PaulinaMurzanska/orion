import { Button } from '@orionsuite/shared-components';
import styled from 'styled-components';

interface DialogProps {
  dialogOpen: boolean;
}

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
  padding: 10px 10px 0 0;
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
  border-radius: 2vh;
  background-color: rgb(211, 211, 211);
  width: 1000px;
  max-width: 1000px;
  min-height: 500px;
  padding: 20px 20px 0 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  row-gap: 20px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 11px 15px -7px,
    rgba(0, 0, 0, 0.14) 0px 24px 38px 3px, rgba(0, 0, 0, 0.12) 0px 9px 46px 8px;
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
  background-color: #00000030;
  z-index: 200;
  opacity: ${(props) => (props.dialogOpen ? '1' : '0')};
  background-color: ${(props) => (props.dialogOpen ? '00000030' : '')};
  pointer-events: ${(props) => (props.dialogOpen ? 'auto' : 'none')};
  visibility: ${(props) => (props.dialogOpen ? 'visible' : 'hidden')};
  transition: all 0.3s ease-out;
`;

export {
  CustomButton,
  CustomTriggerButton,
  StyledInnerContent,
  StyledDialog,
  StyledContentWrapper,
  StyledDialogOpen,
};
