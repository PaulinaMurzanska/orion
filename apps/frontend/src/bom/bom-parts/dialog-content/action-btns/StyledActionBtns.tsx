import { colors, shadows } from '../../../../styles/variables';

import styled from 'styled-components';

interface ActionProps {
  addIcon?: boolean;
}

const StyledActionIcon = styled.div<ActionProps>`
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 37px;
  height: 37px;
  box-shadow: ${shadows.drop_shadow_black};
  background-color: ${(props) =>
    props.addIcon ? colors.lime_500 : colors.blue_primary};
`;

const StyledActionBts = styled.div`
  min-width: 86px;
  min-height: 372px;
  margin-left: 10px;
  display: flex;
  flex-flow: column wrap;
  border-radius: 5px;
  overflow: hidden;
  background-color: ${colors.grey_400};
`;

const ActionBtn = styled.button`
  width: 100%;
  height: 50%;
  border-bottom: 1px solid #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 5px;
  position: relative;
  padding: 0 9px;
  cursor: pointer;
  &:last-child {
    border-bottom: none;
  }

  &:after {
    content: '';
    width: 100%;
    height: 100%;
    background-color: #ffffff7d;
    position: absolute;
    top: 0;
    left: 0;
    display: none;
  }
  &:disabled {
    pointer-events: none;
    &:after {
      display: block;
    }
  }
`;

const StyledActionLabel = styled.span`
  display: block;
  font-size: 14px;
  width: 50px;
  line-height: 20px;
  text-align: center;
  color: white;
  font-weight: 700;
`;

export { StyledActionIcon, ActionBtn, StyledActionBts, StyledActionLabel };
