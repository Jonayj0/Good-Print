
// import { Link } from "react-router-dom";
import "../style/home.css";
import CardProductos from "../components/card-productos";

function Home() {
  return (
    <div className="container">
    <div className="home container">
        <h1 className="titulo-home">Bienvenid@ a Good Print</h1>
      <img className="foto-home mb-5 mt-3" src="https://th.bing.com/th/id/OIP.rrHrZPZw7SmAaa9kGcRilAHaE8?w=283&h=189&c=7&r=0&o=5&dpr=1.3&pid=1.7" alt="imagen-gp" />
    </div>
    <section className="card-producto container mb-5 d-flex justify-content-evenly">
    <CardProductos/>
    <CardProductos/>
    <CardProductos/>
    <CardProductos/>
    </section>
    </div>
  );
}

export default Home;
