import BomImportTool from '../bom/BomImportTool';
import ComponentsLibrary from '../components-library/ComponentsLibrary';
import OrdersTable from '../tables/OrdersTable';
import Root from './Root';
import { createHashRouter } from 'react-router-dom';

export default createHashRouter([
  {
    path: '/',
    element: <Root />,
    children: [
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
