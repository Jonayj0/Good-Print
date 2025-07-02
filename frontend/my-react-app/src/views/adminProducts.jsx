import { useContext, useEffect } from "react";
import { Context } from "../store/AppContext";
import CardProductsAdmin from "../components/card-products-admin.jsx";
import { Link } from "react-router-dom";
import "../style/adminProducts.css";

function AdminProducts() {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.getProducts(true).catch(error => {
            console.error("Error fetching admin products:", error);
        });
    }, [actions]);

    return (
        <div className="admin-products-page">
            <h1 className="admin-products-title">Administrar Productos</h1>

            <section className="admin-products-grid">
                {Array.isArray(store.products) && store.products.length > 0 ? (
                    store.products.map(product => (
                        <CardProductsAdmin
                            key={product.id}
                            id={product.id}
                            name={product.name || 'Producto sin nombre'}
                            description={product.description || 'Sin descripción'}
                            price={product.price || 0}
                            image_url={product.image_url || 'default.jpg'}
                        />
                    ))
                ) : (
                    <p>No hay productos disponibles.</p>
                )}
            </section>

            <div className="admin-add-product-btn">
                <Link to="/admin/products/add" className="btn btn-primary">
                    Añadir Producto
                </Link>
            </div>
        </div>
    );
}

export default AdminProducts;

