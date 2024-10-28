// src/views/AddProduct.jsx
import { useContext, useState } from "react";
import { Context } from "../store/AppContext"; // Asegúrate de que la ruta sea correcta
import { useNavigate } from "react-router-dom"; // Importa useNavigate para redireccionar

function AddProduct() {
    const { actions } = useContext(Context);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const navigate = useNavigate(); // Inicializa useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        const productData = {
            name,
            description,
            price,
            image_url: imageUrl,
        };

        try {
            // Llama a la acción para añadir el producto
            await actions.addProduct(productData);
            // Redirecciona a la página de administración de productos
            navigate('/admin/products');
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    return (
        <div className="add-product-container container">
            <h2 className="text-center mb-3">Añadir Producto</h2>
            <form onSubmit={handleSubmit} className="mb-5">
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control mb-3" 
                        placeholder="Nombre del producto" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                    <input 
                        type="text" 
                        className="form-control mb-3" 
                        placeholder="Descripción" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required 
                    />
                    <input 
                        type="number" 
                        className="form-control mb-3" 
                        placeholder="Precio" 
                        value={price} 
                        onChange={(e) => setPrice(e.target.value)} 
                        required 
                    />
                    <input 
                        type="text" 
                        className="form-control mb-3" 
                        placeholder="URL de la imagen" 
                        value={imageUrl} 
                        onChange={(e) => setImageUrl(e.target.value)} 
                    />
                </div>
                <button type="submit" className="btn btn-primary">Añadir Producto</button>
            </form>
        </div>
    );
}

export default AddProduct;
