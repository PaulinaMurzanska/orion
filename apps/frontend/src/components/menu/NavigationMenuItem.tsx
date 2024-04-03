import styled from 'styled-components';
import { MenuElement } from './types';

const Container = styled.div`
  color: black;
  font-size: 20px;
  cursor: pointer;
  white-space: nowrap;

  display: flex;
  align-items: center;
  justify-items: center;
  gap: 5px;
`;

const MenuItem = ({ item }: { item: MenuElement }) => {
  const { name, onClick, icon } = item;

  return (
    <Container onClick={onClick}>
      {icon}
      {name}
    </Container>
  );
};

export default MenuItem;
