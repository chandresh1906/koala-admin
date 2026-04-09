import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">Koala Admin Panel</h1>
      <div className="text-gray-600 font-medium">Admin User</div>
    </header>
  );
};

export default Header;