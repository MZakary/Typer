import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import NewMainPage from './components/NewMainPage';
import './SCSS/_style.scss';
import NewestTyper from './components/NewestTyper';
import About from './components/About';
import ListeLecons from './components/ListeLecons';
import Levels from './assets/lecons';

function App() {

  return (
    <> 
      <RouterProvider 
        router={createBrowserRouter([
          {
            path: '/',
            element: <Layout />,
            children: [
              { element: <NewMainPage/>, index: true },
              {path: 'lecons', element: <ListeLecons/>},
              {path: 'lecon1', element: <NewestTyper levels={[Levels[0]]} />},
              {path: 'lecon2', element: <NewestTyper levels={[Levels[1]]} />},
              {path: 'lecon3', element: <NewestTyper levels={[Levels[2]]} />},
              
              {path: 'a-propos', element: <About/>},
              {path: '*', element: <Navigate to="/" replace /> },
            ],
          },
        ])}
      />
    </>
  )
}

export default App;
