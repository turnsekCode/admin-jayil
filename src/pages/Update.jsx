import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { useParams, useNavigate } from 'react-router-dom'
import ClipLoader from 'react-spinners/ClipLoader'

const Update = ({ token }) => {
    const { id } = useParams() // Obtener el id del producto desde la URL
    const navigate = useNavigate()

    const [image1, setImage1] = useState(false)
    const [image2, setImage2] = useState(false)
    const [image3, setImage3] = useState(false)
    const [image4, setImage4] = useState(false)

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [description2, setDescription2] = useState('')
    const [category, setCategory] = useState('')
    const [subCategory, setSubCategory] = useState('')
    const [price, setPrice] = useState('')
    const [bestSeller, setBestSeller] = useState(false)
    const [loading, setLoading] = useState(false);
    const [slug, setSlug] = useState('');
    const [metaDescription, setMetaDescription] = useState('')
    const [metaTitle, setMetaTitle] = useState('')
    const [quantity, setQuantity] = useState(1)

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${backendUrl}/api/category/list`, {
                headers: { token },
            });
            setCategories(res.data.categories.filter(cat => cat.category && !cat.subCategory));
            setSubCategories(res.data.categories.filter(cat => cat.subCategory));
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/product/single/${id}`);
                if (res.data.success) {
                    const product = res.data.product;
                    setName(product.name);
                    setDescription(product.description);
                    setDescription2(product.description2);
                    setCategory(product.category);
                    setSubCategory(product.subCategory);
                    setPrice(product.price);
                    setBestSeller(product.bestSeller);
                    setSlug(product.slug);
                    setMetaDescription(product.metaDescription);
                    setMetaTitle(product.metaTitle);
                    setQuantity(product.quantity);

                    // Asignar imágenes existentes al estado
                    setImage1(product.image[0] || false);
                    setImage2(product.image[1] || false);
                    setImage3(product.image[2] || false);
                    setImage4(product.image[3] || false);
                } else {
                    toast.error(res.data.message);
                }
            } catch (error) {
                console.error(error);
                toast.error(error.message);
            }
        };

        fetchProduct();
    }, [id]);


    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setLoading(true);
        try {
            const formData = new FormData()
            formData.append('name', name)
            formData.append('description', description)
            formData.append('description2', description2)
            formData.append('category', category)
            formData.append('subCategory', subCategory)
            formData.append('price', price)
            formData.append('bestSeller', bestSeller)
            formData.append('slug', slug)
            formData.append('metaDescription', metaDescription)
            formData.append('metaTitle', metaTitle)
            formData.append('quantity', quantity)
            image1 && formData.append('image1', image1)
            image2 && formData.append('image2', image2)
            image3 && formData.append('image3', image3)
            image4 && formData.append('image4', image4)

            // Realizar la solicitud para actualizar el producto
            const res = await axios.post(`${backendUrl}/api/product/update/${id}`, formData, { headers: { token } })
            setLoading(true)
            if (res.data.success) {
                toast.success(res.data.message)
                navigate('/list')
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            //console.log(error)
            toast.error(error.message)

        } finally {
            setLoading(false); // Ocultar el estado de carga después de la solicitud
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
            <div>
                <p className='mb-2'>Upload Image</p>
                <div className='flex gap-2'>
                    <label htmlFor='image1'>
                        <img
                            className='w-20'
                            src={image1 && typeof image1 === 'string' ? image1 : image1 ? URL.createObjectURL(image1) : assets.upload_area}
                            alt="Image 1"
                        />
                        <input
                            onChange={(e) => setImage1(e.target.files[0])}
                            type="file"
                            id='image1'
                            hidden
                        />
                    </label>
                    <label htmlFor='image2'>
                        <img
                            className='w-20'
                            src={image2 && typeof image2 === 'string' ? image2 : image2 ? URL.createObjectURL(image2) : assets.upload_area}
                            alt="Image 2"
                        />
                        <input
                            onChange={(e) => setImage2(e.target.files[0])}
                            type="file"
                            id='image2'
                            hidden
                        />
                    </label>
                    <label htmlFor='image3'>
                        <img
                            className='w-20'
                            src={image3 && typeof image3 === 'string' ? image3 : image3 ? URL.createObjectURL(image3) : assets.upload_area}
                            alt="Image 3"
                        />
                        <input
                            onChange={(e) => setImage3(e.target.files[0])}
                            type="file"
                            id='image3'
                            hidden
                        />
                    </label>
                    <label htmlFor='image4'>
                        <img
                            className='w-20'
                            src={image4 && typeof image4 === 'string' ? image4 : image4 ? URL.createObjectURL(image4) : assets.upload_area}
                            alt="Image 4"
                        />
                        <input
                            onChange={(e) => setImage4(e.target.files[0])}
                            type="file"
                            id='image4'
                            hidden
                        />
                    </label>

                </div>
            </div>

            <div className='w-full'>
                <p className='mb-2'>Product name</p>
                <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required />
            </div>
            <div className='w-full'>
                <p className='mb-2'>Product description</p>
                <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Write content here' required />
            </div>

            <div className='w-full'>
                <p className='mb-2'>Product description</p>
                <textarea onChange={(e) => setDescription2(e.target.value)} value={description2} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Write content here' />
            </div>

            <div className="w-full">
                <p className="mb-2">Slug (URL)</p>
                <input onChange={(e) => setSlug(e.target.value)} value={slug} className="w-full max-w-[500px] px-3 py-2" placeholder="Write url here" required />
            </div>

            <div className="w-full">
                <p className="mb-2">Meta descripcíon</p>
                <input onChange={(e) => setMetaDescription(e.target.value)} value={metaDescription} className="w-full max-w-[500px] px-3 py-2" placeholder="Write url here" />
            </div>

            <div className="w-full">
                <p className="mb-2">Meta titulo</p>
                <input onChange={(e) => setMetaTitle(e.target.value)} value={metaTitle} className="w-full max-w-[500px] px-3 py-2" placeholder="Write url here" />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
                <div>
                    <p className="mb-2">Product Category</p>
                    <select onChange={(e) => setCategory(e.target.value)} value={category} className="w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded" required>
                        <option value="" disabled>Select category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat.category}>{cat.category}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <p className="mb-2">Sub Category</p>
                    <select onChange={(e) => setSubCategory(e.target.value)} value={subCategory} className="w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded">
                        <option value="" disabled>Select sub-category</option>
                        {subCategories.map((sub) => (
                            <option key={sub._id} value={sub.subCategory}>{sub.subCategory}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <p className='mb-2'>Product price</p>
                    <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type="number" placeholder='Cantidad' required />
                </div>

                <div>
                    <p className='mb-2'>Product quantity</p>
                    <input onChange={(e) => setQuantity(e.target.value)} value={quantity} className='w-full px-3 py-2 sm:w-[120px]' type="number" placeholder='Cantidad' required />
                </div>
            </div>
            <div className='flex gap-2 mt-2'>
                <input onChange={(e) => setBestSeller(prev => !prev)} checked={bestSeller} type="checkbox" id='bestseller' />
                <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
            </div>
            <button type='submit' className='w-28 py-3 mt-4 bg-[#C15470] text-white'>{loading ? <ClipLoader color="#ffffff" /> : 'UPDATE'}</button>
        </form>
    )
}

export default Update
