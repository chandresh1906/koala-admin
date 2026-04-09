// import React from 'react';

// const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '' }) => {
//   const baseStyle = "px-4 py-2 rounded text-white font-medium focus:outline-none";
//   const variants = {
//     primary: "bg-blue-600 hover:bg-blue-700",
//     danger: "bg-red-600 hover:bg-red-700",
//     secondary: "bg-gray-500 hover:bg-gray-600"
//   };

//   return (
//     <button type={type} onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
//       {children}
//     </button>
//   );
// };

// export default Button;

import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '' }) => {
    const baseStyle = "px-4 py-2 rounded text-white font-medium focus:outline-none";
    const variants = {
      primary: "bg-blue-600 hover:bg-blue-700",
      danger: "bg-red-600 hover:bg-red-700",
      secondary: "bg-gray-500 hover:bg-gray-600"
    };
    
    return (    
      <button type={type} onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
        {children}
      </button>
    );
  };
  
  export default Button;