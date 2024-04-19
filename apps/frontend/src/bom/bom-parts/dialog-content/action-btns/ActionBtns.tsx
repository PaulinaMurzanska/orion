import './StyledActionBtns';

import {
  ActionBtn,
  StyledActionBts,
  StyledActionIcon,
  StyledActionLabel,
} from './StyledActionBtns';
import { mdiArrowRight, mdiPlus } from '@mdi/js';

import Icon from '@mdi/react';
import { RootState } from 'apps/frontend/store';
import { useSelector } from 'react-redux';

interface ActionBtnsProps {
  onAddClick: () => void;
  onActionClick: () => void;
}

const ActionBtns = ({ onAddClick, onActionClick }: ActionBtnsProps) => {
  const fileUploadProgress = useSelector(
    (state: RootState) => state.bom.fileUploadProgress
  );

  return (
    <StyledActionBts>
      <ActionBtn onClick={onAddClick} type="button">
        <StyledActionIcon addIcon={true}>
          <Icon path={mdiPlus} className="w-5 h-5" />
        </StyledActionIcon>
        <StyledActionLabel>Add Files</StyledActionLabel>
      </ActionBtn>
      <ActionBtn
        onClick={onActionClick}
        disabled={fileUploadProgress}
        type="button"
      >
        <StyledActionIcon addIcon={false}>
          <Icon path={mdiArrowRight} className="w-5 h-5" />
        </StyledActionIcon>
        <StyledActionLabel>Begin Upload</StyledActionLabel>
      </ActionBtn>
    </StyledActionBts>
  );
};

export default ActionBtns;
