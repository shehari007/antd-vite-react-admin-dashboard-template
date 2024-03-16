import React from 'react';
import { BrowserRouter, Routes, Route, Router } from 'react-router-dom'
import SignIn from './pages/auth/SignIn';
import Home from './pages/home/Home';
import { ProtectedRoute } from './ProtectedRoute';
const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/dashboard" element={<ProtectedRoute />}>
        <Route path="home" element={<Home />} />
        {/* Handle other routes */}
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;