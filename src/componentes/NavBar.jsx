// components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from '../contexts/AuthContext';
import './Articulo.css';

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light" id="nav">
      <div className="container">
        <Link className="navbar-brand" to="/" >Home</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            {auth.isAuthenticated ? (
              <>
                <li className="nav-item">
                  <AuthProvider>
                  <Link className="nav-link" to="/perfil">Ver Perfiles</Link>
                  </AuthProvider>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={logout}>Cerrar Sesión</button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;