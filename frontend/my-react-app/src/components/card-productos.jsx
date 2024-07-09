import React from "react";
import { Link } from "react-router-dom";

function CardProductos() {
    return (
        <div className="card" style={{width: "18rem"}}>
            <img src="https://th.bing.com/th/id/OIP.rrHrZPZw7SmAaa9kGcRilAHaE8?w=283&h=189&c=7&r=0&o=5&dpr=1.3&pid=1.7" className="card-img-top" alt="..." />
            <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">
                    Some quick example text to build on the card title and make up the
                    bulk of the card's content.
                </p>
                <a href="#" className="btn btn-primary">
                    Go somewhere
                </a>
            </div>
        </div>
    );
}

export default CardProductos;
