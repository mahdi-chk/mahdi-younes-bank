import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-lg font-bold">Mahdi & Younes Bank</p>
            <p className="text-sm text-gray-400">Votre partenaire bancaire de confiance</p>
          </div>
          
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-blue-400 transition">Contact</a>
            <a href="#" className="hover:text-blue-400 transition">Conditions d'utilisation</a>
            <a href="#" className="hover:text-blue-400 transition">Confidentialité</a>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-4 pt-4 text-center text-sm text-gray-400">
          <p>© 2025 Mahdi & Younes Bank. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;