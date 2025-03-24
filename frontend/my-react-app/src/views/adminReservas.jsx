import React, { useEffect, useContext } from "react";
import { Context } from "../store/AppContext";
import Swal from "sweetalert2"; // Importamos SweetAlert2

const AdminReservas = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.getReservations(); // Cargar reservas al montar
    }, []);

    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                actions.deleteReservation(id).then(() => {
                    Swal.fire("Eliminado", "La reserva ha sido eliminada.", "success");
                    actions.getReservations(); // Recargar la lista de reservas
                });
            }
        });
    };


    return (
        <div className="admin-reservas-container container">
            <h1 className="titulo-admin-reservas text-center mb-3">Administrar Reservas</h1>
            <section className="row card-reserva container mb-5 d-flex justify-content-evenly">
                {Array.isArray(store.reservations) && store.reservations.length > 0 ? (
                    store.reservations.map(reserva => (
                        <div key={reserva.id} className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 mb-4 d-flex justify-content-center">
                            <div className="card card-reserva">
                                <div className="card-body">
                                    <h5 className="card-title">Reserva de {reserva.producto.nombre}</h5>
                                    <p><strong>Cliente:</strong> {reserva.nombre_cliente}</p>
                                    <p><strong>Teléfono:</strong> {reserva.telefono_cliente}</p>
                                    <p><strong>Email:</strong> {reserva.email_cliente}</p>
                                    <p><strong>Mensaje:</strong> {reserva.mensaje}</p>
                                    <p><strong>Fecha:</strong> {reserva.fecha_reserva}</p>
                                    <p><strong>Producto:</strong> {reserva.producto.nombre}</p>
                                    <img src={reserva.producto.imagen} alt="Producto" width="100px" />
                                    {/* {reserva.producto && (
                                    <div>
                                        <h4>Producto Reservado: {reserva.producto.nombre}</h4>
                                        <img src={reserva.producto.imagen} alt={reserva.producto.nombre} style={{ width: "150px", height: "auto" }} />
                                    </div>
                                    )}

                                    {reserva.fotos && (
                                        <div>
                                            <h4>Foto enviada por el cliente:</h4>
                                            <img src={reserva.fotos} alt="Foto del cliente" style={{ width: "150px", height: "auto" }} />
                                        </div>
                                    )} */}
                                    {/* <img src={reserva.fotos} alt="Producto" width="100px" /> */}
                                    {/* {reserva.fotos && (
                                        <div>
                                            <h4>Foto enviada por el cliente:</h4>
                                            <img src={reserva.fotos} alt="Foto del cliente" style={{ width: "100px", height: "auto" }} />
                                        </div>
                                    )} */}
                                    <button className="btn btn-danger" onClick={() => handleDelete(reserva.id)}>Eliminar</button>
                                </div>
                            </div>
                        </div>
                        
                    ))
                ) : (
                    <p>No hay reservas pendientes</p>
                )}
            </section>
        </div>
    );
};

export default AdminReservas;