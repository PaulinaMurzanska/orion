import { createBrowserRouter, createHashRouter } from 'react-router-dom';

import OrdersTable from '../tables/OrdersTable';
import PricingTable from '../tables/PricingTable';
import Root from './Root';
import TasksTable from '../tables/TasksTable';

// TODO: Should probably replace with hash router to work with NetSuite
export default createHashRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/tasks',
        element: <TasksTable />,
      },
      {
        path: '/orders',
        element: <OrdersTable />,
      },
      {
        path: '/pricing',
        element: <PricingTable />,
      },
    ],
  },
]);
