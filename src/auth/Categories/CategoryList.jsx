import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Table from '../../components/Comman/Table';
import Button from '../../components/Comman/Button';
import Modal from '../../components/Comman/Modal';
import CategoryForm from './CategoryForm';
import { uploadImage } from '../../utils/uploadImage';
import { useNavigate } from 'react-router-dom';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddClick = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category", error);
      }
    }
  };

  const handleSubmitForm = async (data) => {
    try {
      let mainImageUrl = data.categoryImage;
      let logoUrl = data.collabLogo;

      // ✅ Upload Main Image if it's a new file
      if (data.categoryImage instanceof File) {
        mainImageUrl = await uploadImage(data.categoryImage);
      }

      // ✅ Upload Nested Logo if it's a new file
      if (data.collabLogo instanceof File) {
        logoUrl = await uploadImage(data.collabLogo);
      }

      // Clean up the data object before sending to DB
      const finalData = {
        categoryName: data.categoryName,
        categoryImage: mainImageUrl,
      };

      // Only attach the collab data if the toggle was checked
      if (data.isCollab) {
        finalData.collabLogo = logoUrl;
        finalData.collections = data.collections;
      }

      const response = editingCategory
        ? await api.put(`/categories/${editingCategory.id}`, finalData)
        : await api.post('/categories', { ...finalData, id: Date.now().toString() });

      const savedData = response.data;

      setCategories(prev =>
        editingCategory
          ? prev.map(cat => cat.id === savedData.id ? savedData : cat)
          : [...prev, savedData]
      );

      setIsModalOpen(false); 

    } catch (error) {
      console.error("Error saving category", error);
    }
  };

  const columns = [
    { name: 'ID', selector: row => row.id, sortable: true, width: '100px' },
    { 
      name: 'Image', 
      cell: row => (
        <img 
          src={row.categoryImage} 
          alt={row.categoryName} 
          // Enforcing full rectangular size, no circular clipping
          className="w-24 h-16 object-cover rounded shadow-sm border border-slate-200 bg-white" 
        />
      ) 
    },
    { 
      name: 'Name', 
      selector: row => row.categoryName, 
      sortable: true 
    },
    { 
      name: 'Type', 
      cell: row => (
        row.collabLogo || (row.collections && row.collections.length > 0) 
        ? <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Collab</span> 
        : <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded">Standard</span>
      )
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" onClick={() => handleEditClick(row)}>Edit</Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(row.id)}>Delete</Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Category Management</h2>
        <Button onClick={handleAddClick}>+ Add Category</Button>
      </div>
      
      <Table columns={columns} data={categories} loading={loading} />
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCategory ? "Edit Category" : "Add Category"}>
        <CategoryForm initialData={editingCategory} onSubmit={handleSubmitForm} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default CategoryList;