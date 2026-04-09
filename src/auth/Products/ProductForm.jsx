import React, { useState, useEffect } from 'react';
import InputField from '../../components/Comman/InputField';
import Button from '../../components/Comman/Button';
import api from '../../services/api';

const ProductForm = ({ initialData, onSubmit, onCancel, preSelectedCategoryId }) => {
  const [formData, setFormData] = useState({ 
    productName: '', 
    price: '', 
    image: '', 
    categoryId: preSelectedCategoryId || '' 
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (initialData) setFormData(initialData);
    api.get('/categories').then(res => setCategories(res.data));
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputField label="Product Name" name="productName" value={formData.productName} onChange={handleChange} required />
      <InputField label="Price" type="number" name="price" value={formData.price} onChange={handleChange} required />
      <InputField label="Image URL" name="image" value={formData.image} onChange={handleChange} required />
      
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Category</label>
        <select 
          name="categoryId" 
          value={formData.categoryId} 
          onChange={handleChange} 
          required 
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
        >
          <option value="">Select a Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

export default ProductForm;