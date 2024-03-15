import { persistor, store } from '../../store';

import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import routes from './routes';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <RouterProvider router={routes} />
      </PersistGate>
    </Provider>
  );
};

export default App;
