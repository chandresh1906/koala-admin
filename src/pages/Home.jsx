import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Login from '../auth/Login';
import CategoryList from '../auth/Categories/CategoryList';
import ProductList from '../auth/Products/ProductList';

// Layout wrapper matching the PDF requirements
const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          <Outlet /> 
        </main>
        <Footer />
      </div>
    </div>
  );
};

function Home() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Admin Routes */}
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/categories" replace />} />
          <Route path="categories" element={<CategoryList />} />
          <Route path="products" element={<ProductList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default Home;