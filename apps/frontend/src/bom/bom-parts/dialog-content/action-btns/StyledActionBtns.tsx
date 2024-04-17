import styled from 'styled-components';

const StyledActionIcon = styled.div`
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 37px;
  height: 37px;
  box-shadow: 0px 3px 1px -2px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)),
    0px 2px 2px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)),
    0px 1px 5px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.12));
`;

const StyledActionBts = styled.div`
  min-width: 80px;
  margin-left: 10px;
  border: 1px solid grey;
  display: flex;
  flex-flow: column wrap;
  border-radius: 4px;
  overflow: hidden;
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
  background-color: #989898;
  position: relative;
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
  font-size: 13px;
  width: 70px;
  line-height: 20px;
  text-align: center;
  color: white;
  font-weight: 300;
`;

export { StyledActionIcon, ActionBtn, StyledActionBts, StyledActionLabel };
