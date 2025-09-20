import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={user ? "/dashboard" : "/"} className="text-2xl font-bold text-cyan-400">
          SecurePrint
        </Link>
        <div>
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Logout
            </button>
          ) : (
            <div className="space-x-4">
              <Link to="/" className="hover:text-cyan-400">Login</Link>
              <Link to="/register" className="hover:text-cyan-400">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;