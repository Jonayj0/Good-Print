import { useContext, useEffect } from "react";
import { Context } from "../store/AppContext";
import "../style/product-details.css";

function ProductDetails() {
    const { store, actions } = useContext(Context);

    return (
        <div className="container">
        <div className="product-details container">
            <h1>Detalles</h1>
        </div>
        </div>
    );
}

export default ProductDetails;
