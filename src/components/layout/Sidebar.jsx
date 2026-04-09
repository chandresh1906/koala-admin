import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen flex flex-col">
      <div className="p-6 text-2xl font-bold text-center border-b border-gray-700">
        Koala
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink 
          to="/categories" 
          className={({isActive}) => `block px-4 py-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
        >
          Categories
        </NavLink>
        <NavLink 
          to="/products" 
          className={({isActive}) => `block px-4 py-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
        >
          Products
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;