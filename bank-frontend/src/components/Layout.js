import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from './Footer';

const Layout = ({ children }) => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to={hasRole('AGENT_GUICHET') ? '/agent/dashboard' : '/client/dashboard'} className="text-xl font-bold hover:text-blue-200 transition">
              Mahdi & Younes Bank
            </Link>

            <div className="flex items-center gap-6">
              <span className="text-sm">
                {user?.username} ({user?.role === 'AGENT_GUICHET' ? 'Agent' : 'Client'})
              </span>

              {hasRole('AGENT_GUICHET') && (
                <>
                  <Link to="/agent/dashboard" className="hover:text-blue-200 transition">
                    Tableau de bord
                  </Link>
                  <Link to="/agent/clients" className="hover:text-blue-200 transition">
                    Clients
                  </Link>
                  <Link to="/agent/comptes" className="hover:text-blue-200 transition">
                    Comptes
                  </Link>
                </>
              )}

              {hasRole('CLIENT') && (
                <>
                  <Link to="/client/dashboard" className="hover:text-blue-200 transition">
                    Tableau de bord
                  </Link>
                  <Link to="/client/virement" className="hover:text-blue-200 transition">
                    Nouveau Virement
                  </Link>
                </>
              )}

              <Link to="/change-password" className="hover:text-blue-200 transition">
                Changer mot de passe
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;