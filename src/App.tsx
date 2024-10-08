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
import ConvexHullVisualizer from './containers/convex-hull'
import MinimumSpaningTreeVisualization from './containers/minimum-spanning-tree'
import GraphSearchVisualization from './containers/graph-search'
import AlgorithmSearch from './containers/algorithm-search'
import DynamicProgrammingVisualizer from './containers/dynamic-programming'

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/:topic" element={<AlgorithmSearch />} />
        <Route path="/dynamic-programming/:algorithm" element={<DynamicProgrammingVisualizer />} />
        <Route path="/sorting/:algorithm" element={<Sorting />} />
        <Route path="/path-finding/:algorithm" element={<PathfindingVisualizer />} />
        <Route path="/convex-hull/:algorithm" element={<ConvexHullVisualizer />} />
        <Route path="/graph-search/:algorithm" element={<GraphSearchVisualization />} />
        <Route path="/minimum-spanning-tree/:algorithm" element={<MinimumSpaningTreeVisualization />} />
      </Route>,
    ),
  )

  return <RouterProvider router={router} />
}

export default App
