import { createHashRouter } from 'react-router-dom';

import OrdersTable from '../tables/OrdersTable';
import Root from './Root';

// TODO: Should probably replace with hash router to work with NetSuite
export default createHashRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/orders',
        element: <OrdersTable />,
      },
    ],
  },
]);
