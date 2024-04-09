import BomImportTool from '../bom/BomImportTool';
import ComponentsLibrary from '../components-library/ComponentsLibrary';
import OrdersTable from '../tables/OrdersTable';
import Root from './Root';
import { createHashRouter, Navigate } from 'react-router-dom';
import BomList from '../tables/BomList';

export default createHashRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { path: '/', element: <Navigate to="/orders" /> },
      {
        path: '/bom',
        element: <BomList />,
      },
      {
        path: '/orders',
        element: <OrdersTable />,
      },
      {
        path: '/components',
        element: <ComponentsLibrary />,
      },
      {
        path: '/bom-import',
        element: <BomImportTool />,
      },
    ],
  },
]);
