import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

function CardProductos({ name, description, price, image_url }) {
    return (
        <div className="card" style={{width: "18rem"}}>
            <img src={image_url} className="card-img-top" alt={name} />
            <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <p className="card-text">{description}</p>
                <p className="card-text"><strong>Price:</strong>{price}€</p>
                <Link to="#" className="btn btn-primary">
                    Ver Detalles
                </Link>
            </div>
        </div>
    );
}

CardProductos.propTypes = {
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image_url: PropTypes.string.isRequired,
};

export default CardProductos;
