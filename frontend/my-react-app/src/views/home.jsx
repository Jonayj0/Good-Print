import { useContext, useEffect, useState } from "react";
import { Context } from "../store/AppContext";
import "../style/home.css";
import CardProductos from "../components/card-productos.jsx";
import SplitText from "../components/SplitText.jsx";
import homeImagen from "../assets/HomeImagen.jpeg";

function Home() {
  const { store, actions } = useContext(Context);
  const [selectedCategory, setSelectedCategory] = useState("");

  // useEffect(() => {
  //   if (!store.products.length) {
  //     actions.getProducts().catch((error) => {
  //       console.error("Error fetching products:", error);
  //     });
  //   }
  // }, [store.products.length, actions]);

  // Llamar a getProducts con la categoría seleccionada
  useEffect(() => {
    actions.getProducts(false, selectedCategory).catch(error => {
        console.error("Error fetching products:", error);
    });
  }, [selectedCategory]); // Se ejecuta cada vez que cambia la categoría

  useEffect(() => {
    actions.getCategories();
  }, []);

  return (
    <div className="container-fluid">
      <div className="home container text-center">
        <h1 className="titulo-home">
          <div>
            <SplitText text="Bienvenid@ a" delay={60} />
          </div>
          <div className="titulo-home-2">
            <SplitText text="Good Print" delay={60} />
          </div>
        </h1>
        <img
          className="foto-home mb-5 mt-3"
          src={homeImagen}
          alt="imagen-gp"
        />
        {/* 🔽 Dropdown para seleccionar la categoría 🔽 */}
          <div className="filter-container mb-4">
                <label htmlFor="category-select">Busca por categoría:</label>
                <select
                    id="category-select"
                    className="form-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">Todas</option>
                    {store.categories.map((cat, idx) => (
                        <option key={idx} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                    ))}
                </select>
          </div>
      </div>
      {/* 🔼 Fin del Dropdown 🔼 */}
      <section className="row tarjetas-container">
        {Array.isArray(store.products) && store.products.length > 0 ? (
          store.products.map((product) => (
            <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 col-xxl-3 mb-4 d-flex justify-content-center">
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
          <p>No products available</p>
        )}
      </section>
    </div>
  );
}

export default Home;
