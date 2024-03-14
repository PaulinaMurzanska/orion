import styled from 'styled-components';

interface StyledSelectProps {
  showResults?: boolean;
  width?: string;
}

const StyledFilterSelect = styled.div<StyledSelectProps>`
  width: ${(props) => (props.width ? props.width : '198px')};
`;

const StyledInputWrapper = styled.div<StyledSelectProps>`
  border-radius: ${(props) => (props.showResults ? '6px 6px 0 0' : '6px')};
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid var(--Zinc-200, #e4e4e7);
  background: var(--White, #fff);
  border: 1px solid var(--Zinc-200, #e4e4e7);
`;

const StyledInput = styled.input`
  color: var(--Zinc-950, #09090b);
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  width: 100%;
  outline: none;
  cursor: pointer;
  &::placeholder {
    color: var(--Zinc-500, #71717a);
  }
`;

const StyledMagnifier = styled.div`
  width: 16px;
  height: 16px;
  margin-right: 8px;
`;

const StyledSearchesContainer = styled.div<StyledSelectProps>`
  display: ${(props) => (props.showResults ? 'block' : 'none')};
  width: 100%;
  padding: 4px;
  border: 1px solid var(--Zinc-200, #e4e4e7);
`;

const StyledSelectItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  column-gap: 8px;
  padding: 6px 8px;
  cursor: pointer;
  &:focus,
  &:hover {
    outline: none;
    border-radius: 2px;
    background: var(--Zinc-100, #f4f4f5);
  }
  svg {
    color: var(--Zinc-500, #71717a);
    width: 16px;
    height: 16px;
  }
`;

const StyledSelectLabel = styled.div`
  color: var(--Zinc-950, #09090b);
  font-family: Inter;
  font-size: 14px;
  font-weight: 400;
`;

export {
  StyledFilterSelect,
  StyledInputWrapper,
  StyledInput,
  StyledMagnifier,
  StyledSearchesContainer,
  StyledSelectItem,
  StyledSelectLabel,
};
