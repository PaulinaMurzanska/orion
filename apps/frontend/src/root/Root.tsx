import { Outlet } from 'react-router-dom';

import NavigationMenu from '../components/menu/NavigationMenu';
import styled from 'styled-components';
import { useCallback, useState } from 'react';

const Container = styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: auto 1fr;
  position: relative;
`;

const HiddenOptionsDiv = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 15px;
  height: 15px;
`;

const Root = () => {
  const showMenuStorage = localStorage.getItem('orionsuite.options.showMenu');
  const [showMenu, setShowMenu] = useState(
    JSON.parse(showMenuStorage ?? 'false')
  );

  const onHiddenOptionsClick = useCallback(() => {
    if (showMenu) {
      setShowMenu(false);
      localStorage.setItem('orionsuite.options.showMenu', 'false');
    } else {
      setShowMenu(true);
      localStorage.setItem('orionsuite.options.showMenu', 'true');
    }
  }, [showMenu]);

  return (
    <Container>
      {showMenu && <NavigationMenu />}
      <Outlet />
      <HiddenOptionsDiv onClick={onHiddenOptionsClick} />
    </Container>
  );
};

export default Root;
