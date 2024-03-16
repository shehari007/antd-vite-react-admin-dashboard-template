import React from 'react'
import { BrowserRouter as Routes, Route } from 'react-router-dom'
import SignIn from './pages/auth/SignIn'
import Home from './pages/home/Home'

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        {/* Handle other routes */}
      </Route>
    </Routes>
  )
}

export default MainRoutes
