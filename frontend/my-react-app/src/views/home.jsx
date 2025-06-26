import { useContext, useEffect, useState } from "react";
import { Context } from "../store/AppContext";
import "../style/home.css";
import CardProductos from "../components/card-productos.jsx";
import SplitText from "../components/SplitText.jsx";
import homeImagen from "../assets/HomeImagen.jpeg";

function Home() {
  const { store, actions } = useContext(Context);
  const selectedCategory = store.selectedCategory;

  // Carga productos por defecto si aún no hay
  useEffect(() => {
    if (!store.products.length && selectedCategory === "") {
      actions.getProducts(false, "").catch((error) => {
        console.error("Error fetching default products:", error);
      });
    }
  }, [store.products.length, actions, selectedCategory]);

  // Cargar productos al cambiar categoría
  useEffect(() => {
    if (selectedCategory === "Todas") {
      actions.getProducts(false, "");
    } else {
      actions.getProducts(false, selectedCategory);
    }
  }, [selectedCategory]);

  // Cargar categorías una sola vez
  useEffect(() => {
    actions.getCategories();
  }, []);

  return (
    <div className="container-fluid home-wrapper">
      <div className="home container text-center">
        <h1 className="titulo-home">
          <div>
            <SplitText text="Bienvenid@" delay={60} />
          </div>
          <div className="titulo-home-2">
            <SplitText text="Good Print" delay={60} />
          </div>
        </h1>

        <img className="foto-home mb-4 mt-3" src={homeImagen} alt="imagen-gp" />

        <div className="filter-container mb-4">
          <label htmlFor="category-select">Busca por categoría:</label>
          <select
            id="category-select"
            className="form-select"
            value={selectedCategory}
            onChange={(e) => actions.setSelectedCategory(e.target.value)}
          >
            <option value="Todas">Todas</option>
            {store.categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <section className="row tarjetas-container justify-content-center">
        {Array.isArray(store.products) && store.products.length > 0 ? (
          store.products.map((product) => (
            <div
              key={product.id}
              className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
            >
              <CardProductos
                id={product.id}
                name={product.name || "Unknown Name"}
                description={product.description || "No description available"}
                price={product.price || 0}
                image_url={product.image_url || "default-image-url.jpg"}
              />
            </div>
          ))
        ) : (
          <p>No hay productos disponibles.</p>
        )}
      </section>

      {/* Espaciado visual si hay solo 1 producto */}
      {store.products.length === 1 && <div style={{ height: "30vh" }}></div>}
    </div>
  );
}

export default Home;
