import { Card } from '@orionsuite/shared-components';
import styled from 'styled-components';

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

export { StyledContentWrapper, StyledDropArea, StyledDropActions, StyledCard };
