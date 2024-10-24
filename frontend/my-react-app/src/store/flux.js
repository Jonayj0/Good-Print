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
            // getProducts: async () => {
            //     try {
            //         const url = import.meta.env.VITE_API_BASE_URL + "/products";
            //         console.log('Fetching products from:', url);
            //         const response = await fetch(url);
            //         if (!response.ok) throw new Error("Failed to fetch products");
                    
            //         const products = await response.json();
            //         console.log('Fetched products:', products); // Asegúrate de que los productos se obtienen correctamente
            //         setStore({ products });
            //     } catch (error) {
            //         console.error("Error fetching products:", error);
            //     }
            // },
            // Define otras acciones aquí
            getProducts: async (isAdmin = false) => {
                try {
                    let url = import.meta.env.VITE_API_BASE_URL + "/products";
                    
                    if (isAdmin) {
                        url = import.meta.env.VITE_API_BASE_URL + "/admin/products"; // Ruta protegida para admin
                        const token = localStorage.getItem('token'); // Obtén el token del localStorage
                        if (!token) {
                            console.error("No token found!");
                            return;
                        }
            
                        const response = await fetch(url, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`, // Incluye el token en la solicitud si es admin
                            },
                        });
            
                        if (!response.ok) throw new Error("Failed to fetch admin products");
            
                        const products = await response.json();
                        setStore({ products });
                    } else {
                        const response = await fetch(url); // Para productos normales (sin autenticación)
                        if (!response.ok) throw new Error("Failed to fetch products");
            
                        const products = await response.json();
                        setStore({ products });
                    }
                } catch (error) {
                    console.error("Error fetching products:", error);
                }
            },
            
        },
    };
};
/* eslint-disable no-unused-vars */
export default getState;
