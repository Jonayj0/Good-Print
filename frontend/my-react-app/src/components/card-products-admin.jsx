import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useContext } from "react";
import { Context } from "../store/AppContext"; // Importa el contexto donde tienes el flujo
import Swal from "sweetalert2"; // Importa SweetAlert2
import "../style/card-products-admin.css";

function CardProductsAdmin({ id, name, description, price, image_url }) {
    const { actions } = useContext(Context); // Accede a las acciones del flujo

    // Función para manejar la eliminación con confirmación
    const handleDelete = async (productId) => {
        // Mostrar alerta de confirmación con SweetAlert2
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
            // Si el usuario confirma la eliminación, llamar a la acción deleteProduct
            const deleteResult = await actions.deleteProduct(productId);
            if (deleteResult.success) {
                Swal.fire("Eliminado!", deleteResult.message, "success");
            } else {
                Swal.fire("Error!", deleteResult.message, "error");
            }
        }
    };

    return (
        <div className="tarjeta-productos-admin" style={{ width: "18rem" }}>
            <Link to={`/admin/products/edit/${id}`} className="admin-edit btn btn-success">
                <i className="fa-regular fa-pen-to-square"></i>
            </Link>
            <button
                className="admin-delete btn btn-danger ms-1"
                onClick={() => handleDelete(id)} // Llama a handleDelete con el id del producto
            >
                <i className="fa-solid fa-trash" />
            </button>
            <img src={image_url} className="card-img-top mt-2" alt={name} />
            <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <p className="card-text">{description}</p>
                <p className="card-text">
                    <strong>Precio: </strong>
                    {price}
                    <strong>€</strong>
                </p>
                <Link to="/product-details" className="btn btn-primary mb-1 detalles-btn">
                    Ver Detalles
                </Link>
                <Link to={`/reservar/${id}/${encodeURIComponent(name)}`} className="btn btn-success reservar-btn">
                    Reservar
                </Link>
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
