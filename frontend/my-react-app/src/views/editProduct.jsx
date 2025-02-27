import { useContext, useState, useEffect } from "react";
import { Context } from "../store/AppContext"; 
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../style/editProduct.css";

function EditProduct() {
    const { actions, store } = useContext(Context);
    const { id } = useParams(); // Obtener el ID del producto desde la URL
    const navigate = useNavigate();

    // Estado para los datos del producto
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrl, setImageUrl] = useState(""); // URL directa de imagen
    const [imageFile, setImageFile] = useState(null); // Archivo desde equipo
    const [category, setCategory] = useState("");

    // Cargar los datos del producto al montar el componente
    useEffect(() => {
        const loadProduct = async () => {
            const product = store.products.find((product) => product.id === parseInt(id)); // Buscar en el store
            if (product) {
                setName(product.name);
                setDescription(product.description);
                setPrice(product.price);
                setImageUrl(product.image_url);
                setCategory(product.category || "Añadir categoria");
            } else {
                // Si no está en el store, llama a la API para obtenerlo
                await actions.getProducts(true); // Refresca productos si es necesario
            }
        };

        loadProduct();
    }, [id, store.products, actions]);

    // Manejador de archivo de imagen
    const handleImageFileChange = (e) => {
        setImageFile(e.target.files[0]);
        setImageUrl(""); // Limpia el campo de URL si se selecciona un archivo
    };

    const resetImageFile = () => {
        setImageFile(null); // Limpia el archivo seleccionado
        setImageUrl(""); // Limpia la URL para asegurarse de que no se envíe nada
        document.getElementById("imageFileInput").value = ""; // Limpia el input de archivo
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        let productData = {
            name,
            description,
            price,
            category,
            image_url: imageUrl || "", // Si imageUrl es vacía o null, se envía como cadena vacía
        };
        // Si se seleccionó un archivo, subimos la imagen y obtenemos la URL
    if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "preset_good_print");

        try {
            const response = await fetch("https://api.cloudinary.com/v1_1/dtxkcfugs/image/upload", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                productData.image_url = data.secure_url; // Asigna la URL de Cloudinary
            } else {
                throw new Error("Error al subir la imagen.");
            }
        } catch (error) {
            console.error("Error al subir la imagen:", error);
        }
    }

        try {
            await actions.updateProduct(id, productData, imageFile); // Usa la acción de editar
            Swal.fire({
                icon: "success",
                title: "Producto actualizado",
                text: "El producto se ha actualizado correctamente.",
            });
            navigate("/admin/products"); // Redirige a la lista de productos
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error al actualizar producto",
                text: "No se pudo actualizar el producto. Intenta nuevamente.",
            });
        }
    };

    return (
        <div className="edit-product-container container">
            <h2 className="text-center mb-3">Editar Producto</h2>
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
                    <textarea
                        className="form-control mb-3"
                        placeholder="Descripción"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    <textarea 
                        type="text" 
                        className="form-control mb-3" 
                        placeholder="Categoria" 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)} 
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
                        disabled={imageFile !== null}
                    />
                    <input
                        type="file"
                        className="form-control mb-3"
                        onChange={handleImageFileChange}
                        accept="image/*"
                        id="imageFileInput"
                    />
                    {imageFile && (
                        <button type="button" className="btn btn-danger my-2" onClick={resetImageFile}>
                            Eliminar Imagen
                        </button>
                    )}
                </div>
                <button type="submit" className="btn btn-primary w-100">
                    Actualizar Producto
                </button>
            </form>
        </div>
    );
}

export default EditProduct;
