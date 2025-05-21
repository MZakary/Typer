import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
//import MainPage from './components/MainPage';
import NewMainPage from './components/NewMainPage';
import './SCSS/_style.scss';
import NewTyper from './components/NewTyper';
import NewestTyper from './components/NewestTyper';
import About from './components/About';
import ListeLecons from './components/ListeLecons';
import Levels from './assets/lecons';


// const Levels: string[][] = [
//   // ['a'],
//   ['a', 'aa', 'aaa', 'asdf', 'a', 'aa', 'aaa', 'aaaa', 'a', 'a', 'aaa'],
//   ["s", "ss", "sss", 's', 'sss', 's', 'sa', 'as', 'aa', 'sss', 'ssa', 'aas'],
//   ["d", "dd", "ddd", "dd", "d", "da", "ad", "sds", "ds", "sd", "asd", "sda"],
//   ["f", "ff", "fff", "f", "fa", "fs", "fd", "asdf", "fdsa", "ffd", "ssdf", "assfd", "ddfs", "afds"],
//   ["jjjjjjj", "jjj", "jf", "jjd", "js", "ja", "jjsd", "jfas", "sdfj", "asfjd", "fdjsa"],
//   ["k", "kk", "kkk", "k", "kj", "jjk", "kkj", "kf", "kds", "kad", "kjfd", "sdkf", "sdafkj"],
//   ["l", "lll", "l", "ll", "lk", "ljk", "jkl", "lf", "ld", "ls", "lasdf", "lesa", "aslk", "kljfd"],
//   ["l;", "kl;", ";lkj", "j;lk", ";jlk", ";f", ";fds", "asl;", ";sd,", "asf;", "jkdf;", "jkas;"],
//   ["as;", "la;", "sa;", "las;", "alla;", "sala;", "jasa;", "lada;", "lassa;", "salada;", "salsa;"]
// ];

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
              {path: 'lecon1', element: <NewestTyper levels={[Levels[0]]} lessonName={'La Lettre a'} />},
              {path: 'lecon2', element: <NewestTyper levels={[Levels[1]]} lessonName={'La Lettre a'} />},
              // {path: 'lecon2', element: <NewTyper levels={Levels[1]} lessonName={'La Lettre s'} />},
              // {path: 'lecon3', element: <NewTyper levels={Levels[2]} lessonName={'La Lettre d'} />},
              {path: 'lecon3', element: <NewestTyper levels={[Levels[2]]} lessonName={'La Lettre d'} />},
              // {path: 'lecon4', element: <NewTyper levels={Levels[3]} lessonName={'La Lettre f'} />},
              // {path: 'lecon5', element: <NewTyper levels={Levels[4]} lessonName={'La Lettre j'} />},
              // {path: 'lecon6', element: <NewTyper levels={Levels[5]} lessonName={'La Lettre k'} />},
              // {path: 'lecon7', element: <NewTyper levels={Levels[6]} lessonName={'La Lettre l'} />},
              // {path: 'lecon8', element: <NewTyper levels={Levels[7]} lessonName={'Le point virgule'} />},
              // {path: 'lecon9', element: <NewTyper levels={Levels[8]} lessonName={'Le point virgule (suite)'} />},
              
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
