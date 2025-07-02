import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { Context } from "../store/AppContext";
import Swal from "sweetalert2";
import "../style/card-products-admin.css";

function CardProductsAdmin({ id, name, description, price, image_url }) {
    const { actions } = useContext(Context);
    const [showFullDescription, setShowFullDescription] = useState(false);

    const handleDelete = async (productId) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás deshacer esta acción",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            reverseButtons: true
        });

        if (result.isConfirmed) {
            const deleteResult = await actions.deleteProduct(productId);
            if (deleteResult.success) {
                Swal.fire("Eliminado!", deleteResult.message, "success");
            } else {
                Swal.fire("Error!", deleteResult.message, "error");
            }
        }
    };

    const toggleDescription = () => {
        setShowFullDescription(prev => !prev);
    };

    return (
        <div className="admin-card">
            <div className="admin-card-actions">
                <Link to={`/admin/products/edit/${id}`} className="admin-btn edit">
                    <i className="fa-regular fa-pen-to-square"></i>
                </Link>
                <button className="admin-btn delete" onClick={() => handleDelete(id)}>
                    <i className="fa-solid fa-trash" />
                </button>
            </div>

            <img src={image_url} className="admin-card-img" alt={name} />

            <div className="admin-card-body">
                <h5 className="admin-card-title">{name}</h5>

                <p className={`admin-card-description ${showFullDescription ? 'expanded' : ''}`}>
                    {showFullDescription ? description : `${description.slice(0, 80)}...`}
                    {description.length > 80 && (
                        <button className="admin-see-more" onClick={toggleDescription}>
                            {showFullDescription ? "Ver menos" : "Ver más"}
                        </button>
                    )}
                </p>

                <p className="admin-card-price">
                    <strong>Precio:</strong> {price}€
                </p>

                <div className="admin-card-buttons">
                    <Link to={`/product-details/${id}`} className="admin-btn details">Ver Detalles</Link>
                    <Link to={`/reservar/${id}/${encodeURIComponent(name)}`} className="admin-btn reserve">Reservar</Link>
                </div>
            </div>
        </div>
    );
}

CardProductsAdmin.propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image_url: PropTypes.string.isRequired,
};

export default CardProductsAdmin;

