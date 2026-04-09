import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Table from '../../components/Comman/Table';
import Button from '../../components/Comman/Button';
import Modal from '../../components/Comman/Modal';
import CategoryForm from './CategoryForm';
import {uploadImage} from '../../utils/uploadImage';
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
        console.log("Fetching categories...");
      const response = await api.get('/categories');
      console.log("response", response);
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
    let imageUrl = data.categoryImage;

    // ✅ Upload only if it's a new file
    if (data.categoryImage instanceof File) {
      imageUrl = await uploadImage(data.categoryImage);
    }

    const finalData = {
      ...data,
      categoryImage: imageUrl,
    };

    const response = editingCategory
      ? await api.put(`/categories/${editingCategory.id}`, finalData)
      : await api.post('/categories', finalData);

    const savedData = response.data;

    setCategories(prev =>
      editingCategory
        ? prev.map(cat => cat.id === savedData.id ? savedData : cat)
        : [...prev, savedData]
    );

    setIsModalOpen(false); // ✅ close modal

  } catch (error) {
    console.error("Error saving category", error);
  }
};

const columns = [
    { name: 'ID', selector: row => row.id, sortable: true },
    { name: 'Name', selector: row => row.categoryName, sortable: true },
    { name: 'Image', selector: row => <img src={row.categoryImage} alt={row.categoryName} className="w-16 h-16 object-cover rounded" /> },
    {
      name: 'Actions',
      cell: row => (
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleEditClick(row)}>Edit</Button>
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