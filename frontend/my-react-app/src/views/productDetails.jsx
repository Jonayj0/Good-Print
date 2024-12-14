import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/AppContext";
import "../style/product-details.css";

function ProductDetails() {
    const { actions } = useContext(Context); // Accede a las acciones desde el contexto
    const { productId } = useParams(); // Obtén el ID del producto desde la URL
    const [product, setProduct] = useState(null); // Estado para el producto
    const [loading, setLoading] = useState(true); // Estado de carga
    const [error, setError] = useState(null); // Estado para errores

    useEffect(() => {
        const fetchProduct = async () => {
            const result = await actions.getProductById(productId); // Llama a la acción del fetch
            if (result.success) {
                setProduct(result.product); // Almacena el producto en el estado
            } else {
                setError(result.message); // Maneja el error
            }
            setLoading(false); // Finaliza la carga
        };

        fetchProduct();
    }, [productId, actions]);

    if (loading) {
        return <div className="container">Cargando detalles del producto...</div>;
    }

    if (error) {
        return <div className="container">Error: {error}</div>;
    }

    return (
        <div className="container product-details">
            <h1>Detalles del Producto</h1>
            {product && (
                <div className="product-card">
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="product-image"
                    />
                    <div className="product-info">
                        <h2>{product.name}</h2>
                        <p><strong>Descripción:</strong> {product.description}</p>
                        <p><strong>Precio:</strong> {product.price} €</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductDetails;

