import React, { useState, useEffect } from 'react';
import InputField from '../../components/Comman/InputField';
import Button from '../../components/Comman/Button';

const CategoryForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ 
    categoryName: '', 
    categoryImage: '',
    isCollab: false,
    collabLogo: '',
    collections: []
  });

  const [newCollection, setNewCollection] = useState({ title: '', img: '', discount: '' });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        isCollab: !!initialData.collabLogo || (initialData.collections && initialData.collections.length > 0),
        collections: initialData.collections || []
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // --- Nested Data Management (For Bluey Collections) ---
  const handleAddCollection = () => {
    if (newCollection.title) {
      setFormData({
        ...formData,
        collections: [...formData.collections, { ...newCollection, id: Date.now().toString() }]
      });
      setNewCollection({ title: '', img: '', discount: '' });
    }
  };

  const handleRemoveCollection = (idToRemove) => {
    setFormData({
      ...formData,
      collections: formData.collections.filter(c => c.id !== idToRemove)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEditing = !!initialData;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Base Category Info */}
      <div className="space-y-4">
        <InputField 
          label="Category Name" 
          name="categoryName" 
          value={formData.categoryName} 
          onChange={handleChange} 
          required 
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
          <input 
            type="file"
            name="categoryImage"
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
            required={!isEditing && !formData.categoryImage} 
          />
          {isEditing && typeof formData.categoryImage === 'string' && (
            <p className="text-xs text-gray-500 mt-1">Current: {formData.categoryImage.substring(0, 40)}...</p>
          )}
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Special Collaboration Toggle (Fixes the separation issue) */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="isCollab"
            name="isCollab"
            checked={formData.isCollab}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 rounded border-gray-300"
          />
          <label htmlFor="isCollab" className="ml-2 block font-medium text-slate-800">
            Is this a Special Collaboration? (e.g., Koala x Bluey)
          </label>
        </div>

        {formData.isCollab && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Collaboration Logo (File)</label>
              <input 
                type="file"
                name="collabLogo"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nested Collections Data</label>
              <div className="flex gap-2 mb-3 items-end">
                <div className="flex-1">
                  <input type="text" placeholder="Title (e.g. Playtime Collection)" value={newCollection.title} onChange={e => setNewCollection({...newCollection, title: e.target.value})} className="w-full text-sm p-2 border rounded" />
                </div>
                <div className="flex-1">
                  <input type="text" placeholder="Discount (e.g. 20% off)" value={newCollection.discount} onChange={e => setNewCollection({...newCollection, discount: e.target.value})} className="w-full text-sm p-2 border rounded" />
                </div>
                <div className="flex-1">
                  <input type="text" placeholder="Image Name (e.g. playtime.webp)" value={newCollection.img} onChange={e => setNewCollection({...newCollection, img: e.target.value})} className="w-full text-sm p-2 border rounded" />
                </div>
                <Button type="button" onClick={handleAddCollection} variant="secondary">Add</Button>
              </div>

              {/* Display nested items */}
              <div className="space-y-2">
                {formData.collections.map((col) => (
                  <div key={col.id} className="flex justify-between items-center bg-white border p-2 rounded text-sm">
                    <span><strong>{col.title}</strong> - {col.discount} ({col.img})</span>
                    <button type="button" onClick={() => handleRemoveCollection(col.id)} className="text-red-500 font-bold">&times;</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Category</Button>
      </div>
    </form>
  );
};

export default CategoryForm;