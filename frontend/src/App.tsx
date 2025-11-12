import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/vendor/Dashboard';
import Reservations from './pages/vendor/Reservations';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/vendor/dashboard" replace />} />
        <Route path="/vendor/dashboard" element={<Dashboard />} />
        <Route path="/vendor/reservations" element={<Reservations />} />
      </Routes>
    </div>
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./pages/public/login";
import Register from "./pages/public/register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;

