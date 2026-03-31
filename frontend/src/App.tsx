import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // <-- Add this import
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import Editor from './components/Editor';
import NotesList from './components/NotesList';
import './App.css';
import React from 'react';

const PrivateRoute = ({ children }: { children: React.JSX.Element }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={
        <PrivateRoute>
          <Editor />
        </PrivateRoute>
      } />
      <Route path="/notes" element={
        <PrivateRoute>
          <NotesList />
        </PrivateRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-layout">
          <Toaster position="bottom-left" toastOptions={{ duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
            fontSize: "16px",
            padding: "14px 20px",
            borderRadius: "8px",
          },
          success: {
            style: { background: "green" },
          },
          error: {
            style: { background: "red" },
          },
        }} />
          <Navbar />
          <main className="main-content">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}