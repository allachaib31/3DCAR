import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'


function AppWeb() {
  return (
    <div className='fontZain'>
        <Outlet />
    </div>
  )
}

export default AppWeb