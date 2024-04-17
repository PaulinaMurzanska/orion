import BomImportTool from '../bom/BomImportTool';
import ComponentsLibrary from '../components-library/ComponentsLibrary';
import Root from './Root';
import { createHashRouter, Navigate } from 'react-router-dom';
import BomRecordsView from '../views/records/BomRecordsView';

export default createHashRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { path: '/', element: <Navigate to="/bom" /> },
      {
        path: '/bom',
        element: <BomRecordsView />,
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
