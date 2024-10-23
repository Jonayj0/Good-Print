// src/views/adminProducts.jsx
import React, { useEffect, useState } from 'react';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch('http://localhost:5000/admin/products', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Incluye el token en la cabecera
                }
            });

            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            } else {
                console.error('Failed to fetch products');
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className='container admin-products'>
            <h1>Productos Administrativos</h1>
            <ul>
                {products.map(product => (
                    <li key={product.id}>
                        <h2>{product.name}</h2>
                        <p>{product.description}</p>
                        <p>Precio: ${product.price}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminProducts;
