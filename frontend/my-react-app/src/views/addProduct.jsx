import { useContext, useState } from "react";
import { Context } from "../store/AppContext"; 
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import "../style/addProduct.css";

function AddProduct() {
    const { actions } = useContext(Context);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState(''); // URL directa de imagen
    const [imageFile, setImageFile] = useState(null); // Archivo desde equipo
    const navigate = useNavigate();

    // Manejador de archivo de imagen
    const handleImageFileChange = (e) => {
        setImageFile(e.target.files[0]);
        setImageUrl(''); // Limpia el campo de URL si se selecciona un archivo
    };

    // Manejador de cambio en el campo de URL
    const handleImageUrlChange = (e) => {
        setImageUrl(e.target.value);
        setImageFile(null); // Limpia el archivo si se introduce una URL
    };

    // Función para limpiar el campo de imagen y habilitar el campo de URL
    const resetImageFile = () => {
        setImageFile(null); // Limpia el archivo
        // Limpia también el input de archivo, si es necesario
        document.getElementById('imageFileInput').value = ''; // Limpia el input del archivo
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const productData = {
            name,
            description,
            price,
            image_url: imageUrl // URL directa, si se ha proporcionado
        };

        try {
            await actions.addProductWithImage(productData, imageFile); // Llama a la nueva acción que maneja la carga de imágenes
            Swal.fire({
                icon: 'success',
                title: 'Producto añadido',
                text: 'El producto se ha añadido correctamente.',
            });
            navigate('/admin/products'); // Redirecciona a productos
        } catch (error) {
            console.error("Error al añadir el producto:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error al añadir producto',
                text: error.message || 'No se pudo añadir el producto. Intenta nuevamente.',
            });
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
                        onChange={handleImageUrlChange} // Usa el nuevo manejador para el campo URL
                        disabled={imageFile !== null} // Desactiva si hay un archivo seleccionado
                    />
                    <input 
                        type="file" 
                        className="form-control mb-3" 
                        onChange={handleImageFileChange} 
                        accept="image/*"
                        id="imageFileInput" // Asigna un ID para poder limpiar el input
                    />
                    {/* Botón para resetear el campo de imagen */}
                    {imageFile && (
                        <button type="button" className="btn btn-danger my-2" onClick={resetImageFile}>
                            Eliminar Imagen
                        </button>
                    )}
                </div>
                <button type="submit" className="btn btn-primary w-100">Añadir Producto</button>
            </form>
        </div>
    );
}

export default AddProduct;

