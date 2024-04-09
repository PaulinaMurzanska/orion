import './StyledActionBtns';

import {
  ActionBtn,
  StyledActionBts,
  StyledActionIcon,
  StyledActionLabel,
} from './StyledActionBtns';
import { mdiArrowRight, mdiPlus } from '@mdi/js';

import Icon from '@mdi/react';

interface ActionBtnsProps {
  onAddClick: () => void;
  onActionClick: () => void;
  uploadProgress: boolean;
}

const ActionBtns = ({
  onAddClick,
  onActionClick,
  uploadProgress,
}: ActionBtnsProps) => {
  return (
    <StyledActionBts>
      <ActionBtn onClick={onAddClick}>
        <StyledActionIcon className="bg-green-600">
          <Icon path={mdiPlus} className="w-5 h-5" />
        </StyledActionIcon>
        <StyledActionLabel>Add Files</StyledActionLabel>
      </ActionBtn>
      <ActionBtn onClick={onActionClick} disabled={uploadProgress}>
        <StyledActionIcon className="bg-pink-600">
          <Icon path={mdiArrowRight} className="w-5 h-5" />
        </StyledActionIcon>
        <StyledActionLabel>Import Lines</StyledActionLabel>
      </ActionBtn>
    </StyledActionBts>
  );
};

export default ActionBtns;
