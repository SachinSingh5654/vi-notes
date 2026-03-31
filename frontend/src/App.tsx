import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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