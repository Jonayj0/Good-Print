// src/views/adminProducts.jsx
import { useContext, useEffect } from "react";
import { Context } from "../store/AppContext";
import CardProductsAdmin from "../components/card-products-admin.jsx";
import { Link } from "react-router-dom";

function AdminProducts() {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        // Llama a getProducts con isAdmin=true para obtener los productos protegidos
        actions.getProducts(true).catch(error => {
            console.error("Error fetching admin products:", error);
        });
    }, [actions]);

    return (
        <div className="admin-products-container container">
            <h1 className="titulo-admin-products text-center mb-3">Administrar Productos</h1>
            <section className="card-producto container mb-5 d-flex justify-content-evenly">
                {Array.isArray(store.products) && store.products.length > 0 ? (
                    store.products.map(product => (
                        <CardProductsAdmin
                            key={product.id}
                            id={product.id}
                            name={product.name || 'Unknown Name'}
                            description={product.description || 'No description available'}
                            price={product.price || 0}
                            image_url={product.image_url || 'default-image-url.jpg'}
                        />
                    ))
                ) : (
                    <p>No products available</p>
                )}
            </section>
                <button><Link to="/admin/products/add" className="btn btn-primary">
                Añadir Producto
                </Link></button>
        </div>
    );
}

export default AdminProducts;
