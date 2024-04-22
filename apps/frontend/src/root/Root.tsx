import { Outlet, useNavigate } from 'react-router-dom';

import NavigationMenu from '../components/menu/NavigationMenu';
import styled from 'styled-components';
import { api } from '@orionsuite/api-client';
import { useEffect } from 'react';
import { setColumns } from '../views/records/recordsSlice';
import { useDispatch } from 'react-redux';
import { DEFAULT_GROUP } from '../components/menu/config';

const Container = styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: auto 1fr;
  position: relative;
`;

const Root = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, isLoading } = api.useGetViewsQuery();

  useEffect(() => {
    if (!isLoading && data) {
      data.tableViews.forEach((view) => {
        const json = JSON.parse(view.custrecord_orion_view_json);

        if (json?.id === DEFAULT_GROUP) {
          const columns = json?.columns ?? [];

          dispatch(
            setColumns(
              columns.map((col: any) => ({
                ...col,
                header: col.label,
              }))
            )
          );
          navigate(`/records/${view.scriptid}`);
          return;
        }
      });
    }
  }, [data, dispatch, isLoading, navigate]);

  return (
    <Container>
      <NavigationMenu data={data} loading={isLoading} />
      {!isLoading && <Outlet />}
    </Container>
  );
};

export default Root;
