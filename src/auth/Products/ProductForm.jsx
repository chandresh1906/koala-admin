import React, { useState, useEffect } from 'react';
import InputField from '../../components/Comman/InputField';
import Button from '../../components/Comman/Button';
import api from '../../services/api';

const ProductForm = ({ initialData, onSubmit, onCancel, preSelectedCategoryId }) => {
  // Upgraded state to perfectly match your db.json schema
  const [formData, setFormData] = useState({ 
    title: '', 
    subtitle: '', 
    categoryId: preSelectedCategoryId || '',
    badge: '',
    rating: 5,
    reviewCount: 0,
    expressDelivery: false,
    sizes: [],
    variants: [
      { colorName: '', hex: '#ffffff', price: '', images: [] }
    ]
  });
  
  const [categories, setCategories] = useState([]);
  const [newSize, setNewSize] = useState('');

  useEffect(() => {
    if (initialData) {
      // Ensure we merge existing data safely
      setFormData({ ...formData, ...initialData });
    }
    api.get('/categories').then(res => setCategories(res.data));
  }, [initialData]);

  // Standard input handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  // --- Sizes Management ---
  const handleAddSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
      setFormData({ ...formData, sizes: [...formData.sizes, newSize.trim()] });
      setNewSize('');
    }
  };

  const handleRemoveSize = (sizeToRemove) => {
    setFormData({ ...formData, sizes: formData.sizes.filter(s => s !== sizeToRemove) });
  };

  // --- Variants Management ---
  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index][field] = value;
    setFormData({ ...formData, variants: updatedVariants });
  };

  const handleImagesChange = (index, value) => {
    const imageArray = value.split(',').map(img => img.trim());
    handleVariantChange(index, 'images', imageArray);
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { colorName: '', hex: '#ffffff', price: '', images: [] }]
    });
  };

  const removeVariant = (indexToRemove) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, index) => index !== indexToRemove)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEditing = !!initialData;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
      
      {/* Basic Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField 
          label="Product Title" 
          name="title" 
          value={formData.title} 
          onChange={handleChange} 
          required={!isEditing} 
        />
        <InputField 
          label="Subtitle (e.g. 3-Seater)" 
          name="subtitle" 
          value={formData.subtitle} 
          onChange={handleChange} 
          required={!isEditing} 
        />
        <InputField 
          label="Badge (e.g. Best seller)" 
          name="badge" 
          value={formData.badge} 
          onChange={handleChange} 
        />
        
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Category</label>
          <select 
            name="categoryId" 
            value={formData.categoryId} 
            onChange={handleChange} 
            required={!isEditing} 
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
          >
            <option value="">Select a Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.categoryName || cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center">
        <input 
          type="checkbox" 
          name="expressDelivery" 
          checked={formData.expressDelivery} 
          onChange={handleChange} 
          className="mr-2 h-4 w-4"
        />
        <label className="text-gray-700 font-bold">Available for Express Delivery</label>
      </div>

      <hr className="border-gray-200" />

      {/* Sizes Section */}
      <div>
        <label className="block text-gray-700 font-bold mb-2">Sizes Available</label>
        <div className="flex gap-2 mb-2">
          <input 
            type="text" 
            value={newSize} 
            onChange={(e) => setNewSize(e.target.value)} 
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none"
            placeholder="e.g., 3-Seater (Queen)"
          />
          <Button type="button" onClick={handleAddSize}>Add Size</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.sizes.map((size, idx) => (
            <span key={idx} className="bg-gray-100 border px-3 py-1 rounded flex items-center gap-2">
              {size}
              <button type="button" onClick={() => handleRemoveSize(size)} className="text-red-500 font-bold">&times;</button>
            </span>
          ))}
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Variants Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-gray-700 font-bold text-lg">Color Variants</label>
          <Button type="button" variant="secondary" onClick={addVariant}>+ Add Variant</Button>
        </div>

        <div className="space-y-4">
          {formData.variants.map((variant, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
              {formData.variants.length > 1 && (
                <button type="button" onClick={() => removeVariant(index)} className="absolute top-2 right-2 text-red-500 font-bold">Remove</button>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <InputField 
                  label="Color Name" 
                  value={variant.colorName} 
                  onChange={(e) => handleVariantChange(index, 'colorName', e.target.value)} 
                  required
                />
                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm">Hex Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={variant.hex} onChange={(e) => handleVariantChange(index, 'hex', e.target.value)} className="h-10 w-12" />
                    <input type="text" value={variant.hex} onChange={(e) => handleVariantChange(index, 'hex', e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none" />
                  </div>
                </div>
                <InputField 
                  label="Price" 
                  type="number" 
                  value={variant.price} 
                  onChange={(e) => handleVariantChange(index, 'price', e.target.value)} 
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">Image Files (Comma separated)</label>
                <input 
                  type="text" 
                  value={variant.images.join(', ')} 
                  onChange={(e) => handleImagesChange(index, e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
                  placeholder="01Sofa.webp, 02sofa.webp"
                />
              </div>

              {/* Full-size unclipped image previews */}
              {variant.images.length > 0 && variant.images[0] !== '' && (
                <div className="mt-3 flex gap-4 overflow-x-auto">
                  {variant.images.map((img, i) => (
                    <img 
                      key={i} 
                      src={`/src/assets/${img.trim()}`} 
                      alt="Preview" 
                      className="h-24 w-auto object-cover rounded shadow-sm border border-gray-200 bg-white"
                      onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Img'; }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Product</Button>
      </div>
    </form>
  );
};

export default ProductForm;