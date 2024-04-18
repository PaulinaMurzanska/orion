import NavigationMenuItem from './NavigationMenuItem';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { Separator } from '@orionsuite/shared-components';
import { config } from './config';
import { useMemo } from 'react';
import { api } from '@orionsuite/api-client';

const Container = styled.div`
  background: #2b2b2e;

  height: calc(100vh - 20px);
  padding: 20px 20px;
  position: sticky;
  border-radius: 12px;
  margin: 10px 0 10px 10px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const MenuSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const NavigationMenu = () => {
  const navigate = useNavigate();
  const { data } = api.useGetViewsQuery();

  const menuElements = useMemo(
    () => config({ navigate, tableViews: data?.tableViews ?? [] }),
    [data?.tableViews, navigate]
  );

  return (
    <Container>
      <MenuSection>
        <Logo />
        <Separator />
        {menuElements.map((item) => {
          if (item.separator) {
            return <Separator />;
          }
          return <NavigationMenuItem key={item.name} item={item} />;
        })}
      </MenuSection>
    </Container>
  );
};

export default NavigationMenu;
