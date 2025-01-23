import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
        return <div className="product-details-container">Cargando detalles del producto...</div>;
    }

    if (error) {
        return <div className="product-details-container">Error: {error}</div>;
    }

    return (
        <div className="product-details-container">
            <h1 className="product-details-title">Detalles del Producto</h1>
            {product && (
                <div className="product-details-card">
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="product-details-image"
                    />
                    <div className="product-details-info">
                        <h2 className="product-details-name">{product.name}</h2>
                        <p className="product-details-description">
                            <strong>Descripción:</strong> {product.description}
                        </p>
                        <p className="product-details-price">
                            <strong>Precio:</strong> {product.price} €
                        </p>
                        <Link
                            to={`/reservar/${product.id}/${encodeURIComponent(product.name)}`}
                            className="btn btn-success reserva-btn-details"
                        >
                            Reservar
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductDetails;


