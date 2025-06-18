import { useContext, useState, useEffect } from "react";
import { Context } from "../store/AppContext"; 
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../style/editProduct.css";

function EditProduct() {
    const { actions, store } = useContext(Context);
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [categories, setCategories] = useState([]);
    const [events, setEvents] = useState([]);

    // Normalización para cuando se envía el formulario
    const normalizeArray = (arr) => {
        const cleaned = arr
            .map(str => str.trim())
            .filter(str => str.length > 0)
            .map(str => {
                let norm = str.toLowerCase();
                if (norm.endsWith('s') && norm.length > 3) norm = norm.slice(0, -1);
                return norm;
            });
        return Array.from(new Set(cleaned))
            .map(str => str.charAt(0).toUpperCase() + str.slice(1));
    };

    useEffect(() => {
        const loadProduct = async () => {
            const product = store.products.find(p => p.id === parseInt(id));
            if (product) {
                setName(product.name);
                setDescription(product.description);
                setPrice(product.price);
                setImageUrl(product.image_url);
                setCategories(product.categories || []);
                setEvents(product.events || []);
            } else {
                await actions.getProducts(true);
            }
        };
        loadProduct();
    }, [id, store.products, actions]);

    const handleImageFileChange = (e) => {
        setImageFile(e.target.files[0]);
        setImageUrl("");
    };

    const resetImageFile = () => {
        setImageFile(null);
        setImageUrl("");
        document.getElementById("imageFileInput").value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let productData = {
            name,
            description,
            price,
            categories: normalizeArray(categories),
            events: normalizeArray(events),
            image_url: imageUrl || "",
        };

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
                    productData.image_url = data.secure_url;
                } else {
                    throw new Error("Error al subir la imagen.");
                }
            } catch (error) {
                console.error("Error al subir la imagen:", error);
            }
        }

        try {
            await actions.updateProduct(id, productData, imageFile);
            Swal.fire({
                icon: "success",
                title: "Producto actualizado",
                text: "El producto se ha actualizado correctamente.",
            });
            navigate("/admin/products");
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
                    <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Categorías (separadas por coma)"
                        value={categories.join(", ")}
                        onChange={(e) => {
                            const cats = e.target.value
                                .split(",")
                                .map(c => c.trim())
                                .filter(c => c.length > 0);
                            setCategories(cats);
                        }}
                        required
                    />
                    <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Eventos (separados por coma)"
                        value={events.join(", ")}
                        onChange={(e) => {
                            const evs = e.target.value
                                .split(",")
                                .map(ev => ev.trim())
                                .filter(ev => ev.length > 0);
                            setEvents(evs);
                        }}
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


