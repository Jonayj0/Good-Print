// import axios from "axios";
/* eslint-disable no-unused-vars */ /*Poniendo este codigo comentado de eslint conseguimos evitar avisos de variables no utilizadas */
const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            products: [],
            selectedProduct: null,
            user: null,
            reservations: [],
            categories: [],
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
                    
                    // Establecer el tiempo de expiración a 30 minutos desde ahora
                    const expirationTime = Date.now() + 30 * 60 * 1000; // 30 minutos en milisegundos
                    localStorage.setItem('token', token); // Guarda el token en localStorage
                    localStorage.setItem('tokenExpiration', expirationTime); // Guarda el tiempo de expiración
                    setStore({ user }); // Almacena la información del usuario en el store
            
                    return { success: true };
                } catch (error) {
                    console.error("Error en el login:", error);
                    return { success: false, message: error.message };
                }
            },

            logout: () => {
                localStorage.removeItem('token'); // Elimina el token del localStorage
                localStorage.removeItem('tokenExpiration'); // Elimina el tiempo de expiración
                setStore({ user: null }); // Limpia el usuario del store si tienes uno
            },
            getProducts: async (isAdmin = false, category = "") => {
                try {
                    // Base URL según el tipo de usuario
                    let url = import.meta.env.VITE_API_BASE_URL + (isAdmin ? "/admin/products" : "/products");
            
                    // Si hay categoría, añadirla como parámetro en la URL
                    if (category) {
                        url += `?category=${encodeURIComponent(category.toLowerCase().replace(/s$/, ""))}`;
                    }
            
                    const token = localStorage.getItem("token");
                    const headers = token
                        ? {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        }
                        : { "Content-Type": "application/json" };
            
                    const response = await fetch(url, {
                        method: "GET",
                        headers: headers,
                    });
            
                    if (!response.ok) throw new Error("Failed to fetch products");
            
                    const products = await response.json();
                    setStore({ products });
                } catch (error) {
                    console.error("Error fetching products:", error);
                }
            },
            
            
            // getProducts: async (isAdmin = false) => {
            //     try {
            //         // Selecciona la URL según el tipo de usuario
            //         let url = import.meta.env.VITE_API_BASE_URL + "/products";
            //         if (isAdmin) {
            //             url = import.meta.env.VITE_API_BASE_URL + "/admin/products";
            //         }
            
            //         const token = localStorage.getItem('token');
            //         const headers = token ? { 
            //             'Content-Type': 'application/json',
            //             'Authorization': `Bearer ${token}` 
            //         } : { 'Content-Type': 'application/json' };
            
            //         const response = await fetch(url, {
            //             method: 'GET',
            //             headers: headers
            //         });
            
            //         if (!response.ok) throw new Error("Failed to fetch products");
            
            //         const products = await response.json();
            //         setStore({ products });
            //     } catch (error) {
            //         console.error("Error fetching products:", error);
            //     }
            // },

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
            updateProduct: async (productId, updatedData) => {
                try {
                    const url = `${import.meta.env.VITE_API_BASE_URL}/admin/products/edit/${productId}`; // Ruta para editar el producto
                    const token = localStorage.getItem('token');
            
                    // Verifica si hay un token antes de proceder
                    if (!token) {
                        console.error("No token found!");
                        return;
                    }
            
                    const response = await fetch(url, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`, // Incluye el token en la solicitud
                        },
                        body: JSON.stringify(updatedData), // Envía los datos actualizados del producto
                    });
            
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || "Failed to update product");
                    }
            
                    const result = await response.json();
                    console.log(result.message); // Mensaje de éxito
            
                    // Refrescar la lista de productos después de editar uno
                    await getActions().getProducts(true); // Llama a getProducts para obtener la lista actualizada
            
                    return { success: true, message: result.message }; // Devuelve el resultado para manejarlo en el componente
                } catch (error) {
                    console.error("Error updating product:", error);
                    return { success: false, message: error.message }; // Maneja el error
                }
            },
            deleteProduct: async (productId) => {
                try {
                    // Definir la URL para la eliminación del producto
                    const url = `${import.meta.env.VITE_API_BASE_URL}/admin/products/delete/${productId}`;
                    
                    // Obtener el token de autenticación
                    const token = localStorage.getItem('token');
                    
                    // Verifica si el token está presente
                    if (!token) {
                        console.error("No token found!");
                        return;
                    }
                    
                    // Realizar la solicitud DELETE
                    const response = await fetch(url, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,  // Incluir el token en la solicitud
                        },
                    });
            
                    // Verificar si la respuesta es exitosa
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || "Failed to delete product");
                    }
            
                    // Obtener la respuesta del backend
                    const result = await response.json();
                    console.log(result.message); // Mensaje de éxito
                    
                    // Refrescar la lista de productos después de eliminar uno
                    await getActions().getProducts(true);  // Recargar los productos
            
                    return { success: true, message: result.message }; // Devuelve un mensaje de éxito
            
                } catch (error) {
                    console.error("Error deleting product:", error);
                    return { success: false, message: error.message }; // Manejar el error
                }
            },
            getProductById: async (productId) => {
                try {
                    const url = `${import.meta.env.VITE_API_BASE_URL}/products/${productId}`; // Construye la URL
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
            
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || "Failed to fetch product");
                    }
            
                    const product = await response.json(); // Obtiene los datos del producto
                    console.log("Product fetched successfully:", product);
                    return { success: true, product }; // Devuelve el producto para usarlo en el componente
                } catch (error) {
                    console.error("Error fetching product:", error.message);
                    return { success: false, message: error.message }; // Maneja el error
                }
            },
            getReservations: async () => {
                try {
                    let url = import.meta.env.VITE_API_BASE_URL + "/admin/reservations";
                    const token = localStorage.getItem("token");

                    const headers = token ? { 
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}` 
                        }
                        : { "Content-Type": "application/json" };
            
                    const response = await fetch(url, {
                        method: "GET",
                        headers: headers,
                    });
            
                    if (!response.ok) throw new Error("❌ Error al obtener las reservas");
            
                    const reservations = await response.json();
                    setStore({ reservations });
                } catch (error) {
                    console.error("Error fetching reservations:", error);
                }
            },
            deleteReservation: async (reservationId) => {
                try {
                    const url = `${import.meta.env.VITE_API_BASE_URL}/admin/reservations/${reservationId}`;
                    const token = localStorage.getItem("token");
            
                    const headers = token ? {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    } : { "Content-Type": "application/json" };
            
                    const response = await fetch(url, {
                        method: "DELETE",
                        headers: headers
                    });
            
                    if (!response.ok) throw new Error("❌ Error al eliminar la reserva");
            
                    // Actualizar la lista de reservas después de eliminar una
                    const updatedReservations = getStore().reservations.filter(reserva => reserva.id !== reservationId);
                    setStore({ reservations: updatedReservations });
            
                    console.log("✅ Reserva eliminada con éxito");
                } catch (error) {
                    console.error("Error eliminando la reserva:", error);
                }
            },
            getCategories: async () => {
                try {
                    const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/categories`);
                    if (!resp.ok) throw new Error("Error al obtener categorías");
                    const data = await resp.json(); // [{id, name}, ...]

                    // Extraer solo nombres únicos (ya normalizados desde backend)
                    const categoriasUnicas = [...new Set(data.map(cat => cat.name))];

                    setStore({ categories: categoriasUnicas });
                } catch (error) {
                    console.error("Error al traer categorías", error);
                }
            },  

            
            // Aquí puedes añadir más acciones según sea necesario            
            // getProductsByCategory: async (category) => {
            //     try {
            //         let url = import.meta.env.VITE_API_BASE_URL + "/products";
            //         if (category) {
            //             url += `?category=${encodeURIComponent(category)}`;
            //         }
            
            //         const response = await fetch(url);
            //         if (!response.ok) throw new Error("Error al obtener productos");
            
            //         const products = await response.json();
            //         setStore({ products });  // Actualiza el store con los productos filtrados
            //     } catch (error) {
            //         console.error("Error al filtrar productos por categoría:", error);
            //     }
            // },            
            // Añade otras acciones                                                                        
        },
    };
};
/* eslint-disable no-unused-vars */
export default getState;
