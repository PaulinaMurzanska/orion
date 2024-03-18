import { createHashRouter } from 'react-router-dom';

import ComponentsLibrary from '../components-library/ComponentsLibrary';
import OrdersTable from '../tables/OrdersTable';
import Root from './Root';

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
    ],
  },
]);
