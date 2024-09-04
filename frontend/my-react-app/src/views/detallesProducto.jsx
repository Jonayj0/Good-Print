import { useContext, useEffect } from "react";
import { Context } from "../store/AppContext";
import "../style/detalles-producto.css";

function DetallesProducto() {
    const { store, actions } = useContext(Context);

    return (
        <div className="detalles-producto container">
            <h1>Detalles</h1>
        </div>
    );
}

export default DetallesProducto;