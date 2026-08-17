
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">Mini Contact Book</div>
      {user && (
        <div className="navbar-user">
          <span>{user.username}</span>
          <button onClick={handleLogout} className="btn-link">
            Log out
          </button>
        </div>
      )}
    </header>
  );
}
