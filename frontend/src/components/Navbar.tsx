import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logout Successfully");
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Vi-Notes</Link>
      </div>
      <div className="navbar-links">
        {token ? (
          <>
            <Link to="/" className="nav-link">Add New Note</Link>
            <Link to="/notes" className="nav-link">All Notes</Link>
            <button onClick={handleLogout} className="nav-logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}