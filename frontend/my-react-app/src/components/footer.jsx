import React from "react";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <div className="footer container bg-body-tertiary">
            <ul className="nav justify-content-center">
        <li className="nav-item">
            <Link className="nav-link home" aria-current="page" to="/">Home</Link>
        </li>
        <li className="nav-item">
            <Link className="nav-link api" to="/api-view">API View</Link>
        </li>
        <li className="nav-item">
            <a className="nav-link" href="#">Link</a>
        </li>
        <li className="nav-item">
            <a className="nav-link" href="#">Link</a>
        </li>
        </ul>
        </div>
    )
};

export default Footer;
