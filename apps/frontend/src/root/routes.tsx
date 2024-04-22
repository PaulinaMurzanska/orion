import BomImportTool from '../bom/BomImportTool';
import ComponentsLibrary from '../components-library/ComponentsLibrary';
import Root from './Root';
import { createHashRouter } from 'react-router-dom';
import RecordsView from '../views/records/RecordsView';

export default createHashRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: `/records/:id`,
        element: <RecordsView />,
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
