import { RouterProvider } from 'react-router-dom';
import routes from './routes';
import styled from 'styled-components';

const Container = styled.div`
  //background: #9ca3af;
`;

const App = () => {
  return (
    <Container>
      <RouterProvider router={routes} />
    </Container>
  );
};

export default App;
