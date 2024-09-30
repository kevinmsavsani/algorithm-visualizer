import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom'
import Layout from './containers/layout'
import Home from './containers/home'
import Sorting from './containers/sorting'

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/sorting" element={<Sorting />} />
      </Route>,
    ),
  )

  return <RouterProvider router={router} />
}

export default App
