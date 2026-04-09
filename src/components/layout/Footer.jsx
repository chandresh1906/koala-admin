import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white shadow p-4 text-center text-gray-500 text-sm mt-auto">
      &copy; {new Date().getFullYear()} Koala. All rights reserved.
    </footer>
  );
};

export default Footer;