import React, { useEffect, useContext } from "react";
import { Context } from "../store/AppContext";

const AdminReservas = () => {
    const { store, actions } = useContext(Context);

    // useEffect(() => {
    //     actions.getReservations(true).catch(error => {
    //         console.error("Error fetching admin reservas:", error);
    //     });
    // }, [actions]);
    
    useEffect(() => {
        actions.getReservations(); // Llamar al fetch cuando se monta el componente
    }, []);


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
                                    <button className="btn btn-danger" onClick={() => actions.deleteReserva(reserva.id)}>Eliminar</button>
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