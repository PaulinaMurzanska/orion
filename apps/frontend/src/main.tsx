import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import './main.css';
import App from './root/App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
