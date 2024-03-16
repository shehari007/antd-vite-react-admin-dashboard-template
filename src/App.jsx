import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SignIn from './pages/auth/SignIn';
import Home from './pages/home/Home';
import { ProtectedRoute } from './ProtectedRoute';
import Blank from './pages/blank/Blank';

const App = () => (

  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard/home" />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/dashboard" element={<ProtectedRoute />}>
        <Route path="home" element={<Home />} />
        <Route path="blank" element={<Blank />} />
        {/* Handle other routes */}
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;