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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, isLoading } = api.useGetViewsQuery();
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
  //
  // useEffect(() => {
  //   if (data && data.tableViews) {
  //     const firstView = data?.tableViews[0];
  //     console.log('FIRST VIEW', firstView, data);
  //     const columns =
  //       JSON.parse(firstView?.custrecord_orion_view_json ?? '{}')?.columns ??
  //       [];
  //     dispatch(
  //       setColumns(
  //         columns.map((col: any) => ({
  //           ...col,
  //           header: col.label,
  //         }))
  //       )
  //     );
  //     navigate(`/records/${firstView?.scriptid}`);
  //   }
  // }, [data, dispatch, navigate]);

  return (
    <Container>
      <MenuSection>
        <Logo />
        <Separator />
        {isLoading && <ProgressSpin size={8} />}
        {!isLoading &&
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
