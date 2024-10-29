import { useContext, useState } from "react";
import { Context } from "../store/AppContext"; 
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Variable para almacenar la URL final de la imagen
        let finalImageUrl = imageUrl;

        // Subir imagen a Cloudinary si se selecciona un archivo
        if (imageFile) {
            const formData = new FormData();
            formData.append('file', imageFile);
            formData.append('upload_preset', 'preset_good_print'); // Cambia por tu upload preset

            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/dtxkcfugs/image/upload`, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();
                    finalImageUrl = data.secure_url; // Asigna la URL de Cloudinary
                } else {
                    throw new Error('Error en la respuesta de Cloudinary');
                }
            } catch (error) {
                console.error('Error al subir la imagen:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al cargar imagen',
                    text: 'No se pudo subir la imagen. Intenta nuevamente.',
                });
                return; // Detenemos el proceso si hay un error con Cloudinary
            }
        }

        const productData = {
            name,
            description,
            price,
            image_url: finalImageUrl, // URL final de la imagen (de Cloudinary o directa)
        };

        try {
            await actions.addProduct(productData); // Añade el producto
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
                text: 'No se pudo añadir el producto. Intenta nuevamente.',
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
                        onChange={(e) => setImageUrl(e.target.value)} 
                        disabled={imageFile !== null} // Desactiva si hay un archivo seleccionado
                    />
                    <input 
                        type="file" 
                        className="form-control mb-3" 
                        onChange={handleImageFileChange} 
                        accept="image/*"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Añadir Producto</button>
            </form>
        </div>
    );
}

export default AddProduct;
