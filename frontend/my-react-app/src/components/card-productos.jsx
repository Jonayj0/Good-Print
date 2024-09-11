import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "../style/card-productos.css";

function CardProductos({ id, name, description, price, image_url }) {
  return (
    <div className="tarjeta-productos" style={{ width: "18rem" }}>
      <img src={image_url} className="card-img-top" alt={name} />
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <p className="card-text">{description}</p>
        <p className="card-text">
          <strong>Price: </strong>
          {price}
          <strong>€</strong>
        </p>
        <Link to="/product-details" className="btn btn-primary">
          Ver Detalles
        </Link>
        <Link
          to={`/reservar/${id}/${encodeURIComponent(name)}`}
          className="btn btn-success ms-2"
        >
          Reservar
        </Link>
      </div>
    </div>
  );
}

CardProductos.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  image_url: PropTypes.string.isRequired,
};

export default CardProductos;

