import { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';

const Category = ({ token }) => {
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/category/list`, {
        headers: { token },
      });
      setCategories(res.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        // Update existing category
        await axios.put(
          `${backendUrl}/api/category/update`,
          { id: editId, category },
          { headers: { token } }
        );
        setEditId(null);
      } else {
        // Add new category
        await axios.post(
          `${backendUrl}/api/category/add`,
          { category },
          { headers: { token } }
        );
      }
      setCategory('');
      fetchCategories();
    } catch (error) {
      console.error('Error adding/updating category:', error);
    }
  };

  const handleSubCategorySubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        // Update existing subcategory
        await axios.put(
          `${backendUrl}/api/category/update`,
          { id: editId, subCategory },
          { headers: { token } }
        );
        setEditId(null);
      } else {
        // Add new subcategory
        await axios.post(
          `${backendUrl}/api/category/add`,
          { subCategory },
          { headers: { token } }
        );
      }
      setSubCategory('');
      fetchCategories();
    } catch (error) {
      console.error('Error adding/updating subcategory:', error);
    }
  };

  const handleEdit = (id, existingCategory, existingSubCategory) => {
    setEditId(id);
    setCategory(existingCategory || '');
    setSubCategory(existingSubCategory || '');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/category/remove`, {
        headers: { token },
        data: { id },
      });
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="container mx-auto">
         <p className="mb-2">Nota: debes crear las categorias por separado siempre</p>
      <form onSubmit={handleCategorySubmit} className="mb-6">
        <div>
          <p className="mb-2">Category</p>
          <div className="w-full">
            <input
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
              type="text"
              placeholder="Write category here"
            />
          </div>
        </div>
        <button type="submit" className="w-60 py-2 mt-4 bg-[#C15470] text-white rounded  transition">
          {editId ? 'Update Category' : 'Add Category'}
        </button>
      </form>

      <form onSubmit={handleSubCategorySubmit} className="mb-6">
        <div>
          <p className="mb-2">Sub Category</p>
          <div className="w-full">
            <input
              onChange={(e) => setSubCategory(e.target.value)}
              value={subCategory}
              className="w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
              type="text"
              placeholder="Write sub-category here"
            />
          </div>
        </div>
        <button type="submit" className="w-60 py-2 mt-4 bg-[#C15470] text-white rounded transition">
          {editId ? 'Update SubCategory' : 'Add SubCategory'}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">Categories</h2>
        <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 w-3/4 text-left">Category</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories
              .filter((cat) => cat.category && !cat.subCategory)
              .map((cat) => (
                <tr key={cat._id}>
                  <td className="border border-gray-300 px-4 py-2 text-left">{cat.category}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(cat._id, cat.category, null)}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <h2 className="text-lg font-bold mt-8 mb-4">Sub Categories</h2>
        <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 w-3/4 text-left">Sub Category</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories
              .filter((cat) => cat.subCategory)
              .map((cat) => (
                <tr key={cat._id}>
                  <td className="border border-gray-300 px-4 py-2 text-left">{cat.subCategory}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(cat._id, null, cat.subCategory)}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Category;
