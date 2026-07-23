import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login/Login';

// Using placeholders for pages until they are implemented
const Home = () => <div className="p-4">Home Page</div>;
const Register = () => <div className="p-4">Register Page</div>;
const Dashboard = () => <div className="p-4">Dashboard</div>;
const NotFound = () => <div className="p-4">404 Not Found</div>;

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
