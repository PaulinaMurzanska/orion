import styled from 'styled-components';

const StyledContentWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: left;
  column-gap: 10px;
  row-gap: 10px;
`;

const StyledMinus = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  z-index: 20;
  font-size: 30px;
  &::after {
    content: '-';
  }
  &:hover {
    box-shadow: 0px 0px 26px -2px rgba(66, 68, 90, 1);
  }
`;

export { StyledContentWrapper, StyledMinus };
