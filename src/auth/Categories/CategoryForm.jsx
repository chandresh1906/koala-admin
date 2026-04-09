import React, { useState, useEffect } from 'react';
import InputField from '../../components/Comman/InputField';
import Button from '../../components/Comman/Button';

const CategoryForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ categoryName: '', categoryImage: '' });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

const handleChange = (e) => {
  const { name, value, type, files } = e.target;
if (type === "file") {
  setFormData({ ...formData, [name]: files[0] });
} else {
    setFormData({ ...formData, [name]: value });
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    console.log("formData",formData)
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputField 
        label="Category Name" 
        name="categoryName" 
        value={formData.categoryName} 
        onChange={handleChange} 
        required 
      />
     <InputField 
  label="Category Image" 
  name="categoryImage" 
  type="file"
  onChange={handleChange} 
  required 
/>
      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

export default CategoryForm;