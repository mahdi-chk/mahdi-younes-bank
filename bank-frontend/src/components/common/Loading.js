import React from 'react';

const Loading = ({ message = 'Chargement...' }) => {
  return (
    <div className="flex flex-col justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
      <div className="text-xl text-gray-600">{message}</div>
    </div>
  );
};

export default Loading;