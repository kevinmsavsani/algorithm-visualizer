import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom'
import Layout from './containers/layout'
import Home from './containers/home'
import Sorting from './containers/sorting'
import PathfindingVisualizer from './containers/path-finding'

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/sorting" element={<Sorting />} />
        <Route path="/path-finding" element={<PathfindingVisualizer />} />
      </Route>,
    ),
  )

  return <RouterProvider router={router} />
}

export default App
