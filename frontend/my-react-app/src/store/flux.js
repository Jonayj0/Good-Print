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
        },
    };
};
/* eslint-disable no-unused-vars */
export default getState;
