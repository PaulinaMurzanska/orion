import { Outlet } from 'react-router-dom';

import NavigationMenu from '../components/menu/NavigationMenu';
import styled from 'styled-components';

const Container = styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: auto 1fr;
  position: relative;
`;

const Root = () => {
  return (
    <Container>
      <NavigationMenu />
      <Outlet />
    </Container>
  );
};

export default Root;
