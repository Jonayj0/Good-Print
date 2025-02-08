import { useContext, useEffect } from "react";
import { Context } from "../store/AppContext";
import "../style/home.css";
import CardProductos from "../components/card-productos.jsx";

function Home() {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    if (!store.products.length) {
      actions.getProducts().catch((error) => {
        console.error("Error fetching products:", error);
      });
    }
  }, [store.products.length, actions]);

  return (
    <div className="container-fluid">
      <div className="home container text-center">
        <h1 className="titulo-home">Bienvenid@ a Good Print</h1>
        <img
          className="foto-home mb-5 mt-3"
          src="https://th.bing.com/th/id/OIP.rrHrZPZw7SmAaa9kGcRilAHaE8?w=283&h=189&c=7&r=0&o=5&dpr=1.3&pid=1.7"
          alt="imagen-gp"
        />
      </div>
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
