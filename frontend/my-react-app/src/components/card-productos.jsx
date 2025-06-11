import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useState, memo } from "react";
import "../style/card-productos.css";

function CardProductos({ id, name, description, price, image_url }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Memoizamos la función toggle para evitar recrearla en cada render
  const toggleExpand = () => setIsExpanded(prev => !prev);

  // Memoizamos el cálculo del texto truncado
  const truncatedDescription = description.length > 100 
    ? `${description.slice(0, 100)}...` 
    : description;

  return (
    <div className="tarjeta-productos">
      <Link to={`/product-details/${id}`} className="img">
        <img src={image_url} className="card-img-top" alt={name} />
      </Link>
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <p className={`card-text ${isExpanded ? "expanded" : ""}`}>
          {isExpanded ? description : truncatedDescription}
        </p>
        {description.length > 100 && (
          <span className="leer-mas" onClick={toggleExpand}>
            {isExpanded ? " Ver menos" : " Leer más"}
          </span>
        )}
        <p className="card-text">
          <strong>Precio: </strong>
          {price} <strong>€</strong>
        </p>
        <div className="card-buttons">
          <Link to={`/product-details/${id}`} className="btn btn-primary detalles-btn">
            Detalles
          </Link>
          <Link
            to={`/reservar/${id}/${encodeURIComponent(name)}`}
            className="btn btn-success reservar-btn"
          >
            Reservar
          </Link>
        </div>
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

// Exportamos con memo y comparador personalizado
export default memo(CardProductos, (prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.name === nextProps.name &&
    prevProps.description === nextProps.description &&
    prevProps.price === nextProps.price &&
    prevProps.image_url === nextProps.image_url
  );
});