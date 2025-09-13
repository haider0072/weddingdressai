
import React from 'react';

const Loader: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
      <div className="w-12 h-12 border-4 border-t-pink-500 border-gray-200 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-gray-700 font-semibold">{message}</p>
    </div>
  );
};

export default Loader;
