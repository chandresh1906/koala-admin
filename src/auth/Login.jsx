import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/Comman/InputField';
import Button from '../components/Comman/Button';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login
    navigate('/categories');
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>
        <InputField label="Username" name="username" value={credentials.username} onChange={handleChange} required />
        <InputField label="Password" type="password" name="password" value={credentials.password} onChange={handleChange} required />
        <Button type="submit" className="w-full mt-4">Login</Button>
      </form>
    </div>
  );
};

export default Login;