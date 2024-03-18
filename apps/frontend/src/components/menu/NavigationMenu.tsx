import { DashboardIcon, GearIcon, PersonIcon } from '@radix-ui/react-icons';

import { MenuElement } from './types';
import NavigationMenuItem from './NavigationMenuItem';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  height: 100vh;

  background: #e0e0e0;
  padding: 20px 30px;
  position: sticky;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const MenuSection = styled.div`
  display: flex;
  flex-direction: column;

  gap: 15px;
`;

const NavigationMenu = () => {
  const navigate = useNavigate();

  const topConfig = [
    {
      name: 'Orders',
      onClick: () => {
        navigate('/orders');
      },
      icon: <PersonIcon width="18px" height="18px" />,
    },
    {
      name: 'Components Library',
      onClick: () => {
        navigate('/components');
      },
      icon: <DashboardIcon width="18px" height="18px" />,
    },
  ] as MenuElement[];

  const bottomConfig = [
    {
      name: 'Settings',
      onClick: () => {
        navigate('/');
      },
      icon: <GearIcon width="18px" height="18px" />,
    },
  ] as MenuElement[];

  return (
    <Container>
      <MenuSection>
        {topConfig.map((item) => (
          <NavigationMenuItem key={item.name} item={item} />
        ))}
      </MenuSection>
      <MenuSection style={{ justifyContent: 'flex-end' }}>
        {bottomConfig.map((item) => (
          <NavigationMenuItem key={item.name} item={item} />
        ))}
      </MenuSection>
    </Container>
  );
};

export default NavigationMenu;
