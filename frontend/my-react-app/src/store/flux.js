// import axios from "axios";
/* eslint-disable no-unused-vars */ /*Poniendo este codigo comentado de eslint conseguimos evitar avisos de variables no utilizadas */
const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            products: [],
            selectedProduct: null,
            user: null,
            // Añade otros estados iniciales aquí
        },
        actions: {
            getMessage: async () => {
                try {
                    const resp = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/hello");
                    const data = await resp.json();
                    setStore({ message: data.message });
                } catch (error) {
                    console.error("Error fetching message:", error);
                }
            },
            login: async (email, password) => {
                try {
                    const response = await fetch(import.meta.env.VITE_API_BASE_URL + "/login", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password }),
                    });

                    if (!response.ok) throw new Error('Error en el inicio de sesión');

                    const { token, user } = await response.json();
                    localStorage.setItem('token', token); // Guarda el token en localStorage
                    setStore({ user }); // Almacena la información del usuario en el store

                    return { success: true };
                } catch (error) {
                    console.error("Error en el login:", error);
                    return { success: false, message: error.message };
                }
            },

            logout: () => {
                localStorage.removeItem('token'); // Elimina el token del localStorage
                setStore({ user: null }); // Limpia el usuario del store si tienes uno
            },
            
            getProducts: async (isAdmin = false) => {
                try {
                    // Selecciona la URL según el tipo de usuario
                    let url = import.meta.env.VITE_API_BASE_URL + "/products";
                    if (isAdmin) {
                        url = import.meta.env.VITE_API_BASE_URL + "/admin/products";
                    }
            
                    const token = localStorage.getItem('token');
                    const headers = token ? { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    } : { 'Content-Type': 'application/json' };
            
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: headers
                    });
            
                    if (!response.ok) throw new Error("Failed to fetch products");
            
                    const products = await response.json();
                    setStore({ products });
                } catch (error) {
                    console.error("Error fetching products:", error);
                }
            },

            // Nueva función para añadir un producto
            addProduct: async (productData) => {
                try {
                    const url = import.meta.env.VITE_API_BASE_URL + "/admin/products/add"; // Ruta para añadir productos
                    const token = localStorage.getItem('token');

                    // Verifica si hay un token antes de proceder
                    if (!token) {
                        console.error("No token found!");
                        return;
                    }

                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}` // Incluye el token en la solicitud
                        },
                        body: JSON.stringify(productData) // Envía los datos del nuevo producto
                    });

                    if (!response.ok) throw new Error("Failed to add product");

                    const result = await response.json();
                    console.log(result.message); // Mensaje de éxito

                    // Actualiza la lista de productos después de añadir uno nuevo
                    await getActions().getProducts(true); // Llama a getProducts para refrescar la lista
                } catch (error) {
                    console.error("Error adding product:", error);
                }
            },
            addProductWithImage: async (productData, imageFile) => {
                let finalImageUrl = productData.image_url;
        
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
                        throw new Error('No se pudo subir la imagen. Intenta nuevamente.'); // Lanza el error para que se maneje en el componente
                    }
                }
        
                // Finalmente, agrega el producto
                productData.image_url = finalImageUrl; // Usa la URL final de la imagen (de Cloudinary o directa)
                await getActions().addProduct(productData); // Llama a la acción original para añadir el producto
            },            
        },
    };
};
/* eslint-disable no-unused-vars */
export default getState;
