import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import NewMainPage from './components/NewMainPage';
import './SCSS/_style.scss';
import NewestTyper from './components/NewestTyper';
import About from './components/About';
import ListeLecons from './components/ListeLecons';
import Levels from './assets/lecons';

function App() {
  const lessonRoutes = Levels.map((level, index) => ({
    path: `lecon${index + 1}`,
    element: <NewestTyper levels={[level]} />
  }));

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        { element: <NewMainPage />, index: true },
        { path: 'lecons', element: <ListeLecons /> },
        ...lessonRoutes,
        { path: 'a-propos', element: <About /> },
        { path: '*', element: <Navigate to="/" replace /> },
      ]
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;