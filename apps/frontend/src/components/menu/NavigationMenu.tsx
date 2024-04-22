import NavigationMenuItem from './NavigationMenuItem';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { Separator } from '@orionsuite/shared-components';
import { config } from './config';
import { useEffect, useMemo } from 'react';
import { api } from '@orionsuite/api-client';
import ProgressSpin from '../progress-spin/ProgressSpin';
import { useDispatch } from 'react-redux';
import { setColumns } from '../../views/records/recordsSlice';

const Container = styled.div`
  background: #2b2b2e;
  height: calc(90vh - 25px);
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

interface Props {
  loading: boolean;
  data: any;
}

const NavigationMenu = ({ data, loading }: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updateRecord] = api.useUpdateRecordMutation();

  const menuElements = useMemo(
    () =>
      config({
        navigate,
        dispatch,
        updateRecord,
        tableViews: data?.tableViews ?? [],
      }),
    [data?.tableViews, dispatch, navigate, updateRecord]
  );

  return (
    <Container>
      <MenuSection>
        <Logo />
        <Separator />
        {loading && <ProgressSpin variant="primary" size={20} />}
        {!loading &&
          menuElements.map((item, index) => {
            if (item.separator) {
              return <Separator key={index} />;
            }
            return <NavigationMenuItem key={index} item={item} />;
          })}
      </MenuSection>
    </Container>
  );
};

export default NavigationMenu;
