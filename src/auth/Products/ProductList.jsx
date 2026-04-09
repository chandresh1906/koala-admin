import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import Table from '../../components/Comman/Table';
import Button from '../../components/Comman/Button';
import Modal from '../../components/Comman/Modal';
import ProductForm from './ProductForm';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategoryId = searchParams.get('categoryId') || '';

  const fetchProductsAndCategories = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);
      
      let fetchedProducts = prodRes.data;
      // Filter if category is selected
      if (selectedCategoryId) {
        fetchedProducts = fetchedProducts.filter(p => p.categoryId === selectedCategoryId);
      }
      
      setProducts(fetchedProducts);
      setCategories(catRes.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, [selectedCategoryId]);

  const handleFilterChange = (e) => {
    const val = e.target.value;
    if (val) setSearchParams({ categoryId: val });
    else setSearchParams({});
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProductsAndCategories();
      } catch (error) {
        console.error("Error deleting product", error);
      }
    }
  };

  const handleSubmitForm = async (data) => {
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, data);
      } else {
        await api.post('/products', data);
      }
      setIsModalOpen(false);
      fetchProductsAndCategories();
    } catch (error) {
      console.error("Error saving product", error);
    }
  };

  const columns = [
    { name: 'ID', selector: row => row.id, sortable: true, width: '80px' },
    { 
      name: 'Image', 
      cell: row => <img src={row.image} alt={row.productName} className="w-12 h-12 object-cover rounded" />
    },
    { name: 'Name', selector: row => row.productName, sortable: true },
    { name: 'Price', selector: row => `$${row.price}`, sortable: true },
    { 
      name: 'Category', 
      selector: row => {
        const cat = categories.find(c => String(c.id) === String(row.categoryId));
        return cat ? cat.categoryName : 'Unknown';
      }
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={() => handleEditClick(row)}>Edit</Button>
          <Button variant="danger" onClick={() => handleDelete(row.id)}>Delete</Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Button onClick={handleAddClick}>+ Add Product</Button>
      </div>

      <div className="mb-4">
        <label className="font-bold mr-2">Filter by Category:</label>
        <select value={selectedCategoryId} onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
          ))}
        </select>
      </div>

      <Table columns={columns} data={products} loading={loading} />
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? "Edit Product" : "Add Product"}>
        <ProductForm 
          initialData={editingProduct} 
          onSubmit={handleSubmitForm} 
          onCancel={() => setIsModalOpen(false)} 
          preSelectedCategoryId={selectedCategoryId}
        />
      </Modal>
    </div>
  );
};

export default ProductList;