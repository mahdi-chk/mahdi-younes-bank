import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.login(username, password);
      login(data.token, { username: data.username, role: data.role });
    } catch (err) {
      setError(err.response?.data?.message || 'Login ou mot de passe erronés');
    } finally {
      setLoading(false);
    }
  };

  // Icônes SVG inline
  const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
  );

  const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  );

  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
    </svg>
  );

  const AlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Section gauche - Illustration */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full -mr-32 -mt-32 opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full -ml-48 -mb-48 opacity-20"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <LockIcon />
              </div>
              <h1 className="text-2xl font-bold">Mahdi & Younes Bank</h1>
            </div>
            
            <h2 className="text-4xl font-bold mb-6">
              Bienvenue sur votre <span className="text-blue-200">espace sécurisé</span>
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              Accédez à vos comptes, effectuez des opérations bancaires et gérez vos finances en toute sécurité depuis notre plateforme en ligne.
            </p>
          </div>

          <div className="relative z-10 mt-8">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="font-semibold">Sécurité garantie</p>
                <p className="text-sm text-blue-200">Protocole de chiffrement SSL 256 bits</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section droite - Formulaire */}
        <div className="md:w-1/2 p-8 md:p-12">
          <div className="md:hidden mb-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <LockIcon />
              </div>
              <h1 className="text-2xl font-bold text-blue-900">Mahdi & Younes Bank</h1>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Connexion
              </h2>
              <p className="text-gray-600">
                Entrez vos identifiants pour accéder à votre compte
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                  <div className="flex items-center">
                    <AlertIcon className="w-5 h-5 text-red-500 mr-3" />
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Champ Identifiant */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    <div className="flex items-center">
                      <UserIcon className="w-4 h-4 mr-2 text-blue-600" />
                      Identifiant
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                      placeholder="Entrez votre identifiant"
                      required
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <UserIcon className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Champ Mot de passe */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    <div className="flex items-center">
                      <LockIcon className="w-4 h-4 mr-2 text-blue-600" />
                      Mot de passe
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pl-12 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                      placeholder="Entrez votre mot de passe"
                      required
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <LockIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOffIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Connexion en cours...</span>
                  </>
                ) : (
                  <>
                    <LockIcon className="w-5 h-5" />
                    <span>Se connecter</span>
                  </>
                )}
              </button>

              <div className="text-center pt-6 border-t border-gray-100">
                <p className="text-gray-500 text-sm">
                  Vous avez oublié vos identifiants ?{' '}
                  <a href="#" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">
                    Contactez le support
                  </a>
                </p>
              </div>
            </form>

            {/* Message de sécurité */}
            <div className="mt-10 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <LockIcon className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-800 font-medium">
                    Connexion sécurisée
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Votre connexion est protégée par un chiffrement de niveau bancaire
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;