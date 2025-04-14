import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/list`);
      if (res.data.success) {
        const sortedProducts = res.data.products.sort((a, b) => b._id.localeCompare(a._id));
        setList(sortedProducts);
        setFilteredList(sortedProducts);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const res = await axios.post(`${backendUrl}/api/product/remove`, { id }, { headers: { token } });
      if (res.data.success) {
        toast.success(res.data.message);
        await fetchList();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (product) => {
    navigate(`/add/${product._id}`);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = list.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      product.subCategory.toLowerCase().includes(term)
    );
    setFilteredList(filtered);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sorted = [...filteredList].sort((a, b) => {
      const aValue = key === 'price' ? parseFloat(a[key]) : a[key].toLowerCase();
      const bValue = key === 'price' ? parseFloat(b[key]) : b[key].toLowerCase();

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredList(sorted);
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <div className='flex justify-between items-center mb-2'>
        <p className='font-semibold'>All products list ({filteredList.length})</p>
        <input
          type="text"
          placeholder="Search products..."
          className="border px-2 py-1 rounded-md text-sm"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className='flex flex-col gap-2'>
        <div className='hidden md:grid grid-cols-[1fr,2fr,1fr,1fr,1fr,1fr] items-center py-1 px-2 border bg-gray-100 text-sm font-medium'>
          <b>Image</b>
          <b className='cursor-pointer hover:underline' onClick={() => handleSort('name')}>Name</b>
          <b className='cursor-pointer hover:underline' onClick={() => handleSort('category')}>Category</b>
          <b className='cursor-pointer hover:underline' onClick={() => handleSort('subCategory')}>Sub Category</b>
          <b className='cursor-pointer hover:underline' onClick={() => handleSort('price')}>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {
          filteredList.map((product, index) => (
            <div key={index} className='grid grid-cols-[1fr,3fr,1fr] md:grid-cols-[1fr,2fr,1fr,1fr,1fr,1fr] items-center gap-2 px-2 py-1 border text-sm'>
              <img src={product.image[0]} alt={product.name} className='w-12 object-cover' />
              <p>{product.name}</p>
              <p>{product.category}</p>
              <p>{product.subCategory}</p>
              <p>{product.price}{currency}</p>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(product)} className='bg-yellow-500 text-white px-2 py-1 rounded-md'>Edit</button>
                <button onClick={() => removeProduct(product._id)} className='bg-red-500 text-white px-2 py-1 rounded-md'>Remove</button>
              </div>
            </div>
          ))
        }
      </div>
    </>
  );
};

export default List;
