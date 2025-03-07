import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import RenewLicenseForm from './components/RenewLicenseForm';
import AddLicenseForm from './components/AddLicenseForm';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route: Redirect to /login or /dashboard based on authentication */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Other routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/add-license" element={<AddLicenseForm />} />
        <Route path="/renew-license" element={<RenewLicenseForm />} />
      </Routes>
    </Router>
  );
}

export default App;