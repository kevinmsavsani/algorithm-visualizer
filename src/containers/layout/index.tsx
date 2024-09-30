import Navbar from '@/components/navbar'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
      <div>
        <Navbar />
        <div className="">
          <Outlet />
        </div>
      </div>
  )
}

export default Layout
