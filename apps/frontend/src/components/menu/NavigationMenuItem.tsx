import styled from 'styled-components';
import { MenuElement } from './types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@orionsuite/shared-components';
import { ChevronRightIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

const Container = styled.div`
  color: white;
  font-size: 20px;
  cursor: pointer;
  white-space: nowrap;

  position: relative;

  display: flex;
  align-items: center;
  justify-items: center;
`;

const StyledDropdownMenuContent = styled(DropdownMenuContent)`
  position: absolute;
  left: 20px;
  top: -40px;
`;

const MenuItem = ({ item }: { item: MenuElement }) => {
  const { name, onClick, icon, dropdown } = item;
  const location = useLocation();

  const isSelected = useMemo(() => {
    if (!item.route) return false;
    return location.pathname.includes(item.route);
  }, [item.route, location.pathname]);

  return (
    <DropdownMenu>
      <Container onClick={onClick} placeholder={name} aria-placeholder={name} >
        <DropdownMenuTrigger
          asChild
          className={`${
            isSelected ? 'bg-blue-600' : ''
          } flex items-center justify-center rounded-md`}
          style={{ width: '35px', height: '35px' }}
        >
          <div className="flex items-center relative bg-blue">
            {icon}
            {dropdown?.items && (
              <ChevronRightIcon
                className="absolute left-6"
                width="12px"
                height="12px"
              />
            )}
          </div>
        </DropdownMenuTrigger>

        {dropdown && (
          <StyledDropdownMenuContent className="w-56 dark">
            <DropdownMenuLabel>{dropdown.header}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {dropdown.items.map((item) => (
                <DropdownMenuItem
                  onClick={item.onClick}
                  className="cursor-pointer"
                >
                  {item.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </StyledDropdownMenuContent>
        )}
      </Container>
    </DropdownMenu>
  );
};

export default MenuItem;
