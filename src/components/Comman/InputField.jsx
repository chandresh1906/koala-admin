import React from 'react';

const InputField = ({ label, name, type = 'text', value, onChange, placeholder, required = false }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-gray-700 font-bold mb-2">{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
      />
    </div>
  );
};

export default InputField;