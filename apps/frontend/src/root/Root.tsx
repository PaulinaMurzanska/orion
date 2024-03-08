import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import NavigationMenu from "../components/menu/NavigationMenu";

const Container = styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: auto 1fr;
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
