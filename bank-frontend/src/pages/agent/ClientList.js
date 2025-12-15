import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clientService from '../../services/clientService';

const ClientList = () => {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const data = await clientService.getAllClients();
      setClients(data);
    } catch (err) {
      setError('Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter((client) =>
    client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.numeroIdentite.includes(searchTerm) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Liste des clients</h2>

        <button
          onClick={() => navigate('/agent/add-client')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          + Nouveau client
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white rounded-lg shadow-lg p-6">

        {/* Search bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Rechercher un client (nom, prénom, numéro d'identité, email)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Nom complet
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Numéro d'identité
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Identifiant
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    Aucun client trouvé
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {client.prenom} {client.nom}
                    </td>
                    <td className="px-6 py-4">{client.numeroIdentite}</td>
                    <td className="px-6 py-4">{client.email}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {client.username}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-4 text-sm text-gray-600">
          Total: {filteredClients.length} client(s)
        </div>
      </div>
    </div>
  );
};

export default ClientList;
