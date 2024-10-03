import { CommonBreadcrumb } from '@/components/breadcrumb'
import Navbar from '@/components/navbar'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div>
      <Navbar />
      <div className="pt-14">
        <CommonBreadcrumb />
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
