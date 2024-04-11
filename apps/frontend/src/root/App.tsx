import { persistor, store } from '../../store';

import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import routes from './routes';
import { ThemeProvider } from '@orionsuite/shared-components';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <ThemeProvider defaultTheme="light" storageKey="shad-theme">
          <RouterProvider router={routes} />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
