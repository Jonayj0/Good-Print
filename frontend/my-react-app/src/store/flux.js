// import axios from "axios";
/* eslint-disable no-unused-vars */ /*Poniendo este codigo comentado de eslint conseguimos evitar avisos de variables no utilizadas */
const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            products: [],
            selectedProduct: null,
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
            getProducts: async () => {
                try {
                    const url = import.meta.env.VITE_API_BASE_URL + "/products";
                    console.log('Fetching products from:', url);
                    const response = await fetch(url);
                    if (!response.ok) throw new Error("Failed to fetch products");
                    
                    const products = await response.json();
                    console.log('Fetched products:', products); // Asegúrate de que los productos se obtienen correctamente
                    setStore({ products });
                } catch (error) {
                    console.error("Error fetching products:", error);
                }
            },
            // Define otras acciones aquí
        },
    };
};
/* eslint-disable no-unused-vars */
export default getState;
