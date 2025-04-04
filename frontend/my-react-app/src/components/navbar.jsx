import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../style/navbar.css"
import logo from "../assets/Definitivo-ok.png"
import Logout from "../components/Logout";

function Navbar() {

    const location = useLocation(); // Para obtener la ruta actual
    const isAdminRoute = location.pathname.startsWith("/admin"); // Verifica si la ruta es /admin
    const token = localStorage.getItem('token'); // Verifica si hay un token

    return (
        <>
            <nav className="navbar container-fluid navbar-expand-lg">
                <div className="container-fluid">
                    <Link to={isAdminRoute ? "/admin/products" : "/"}>
                        <img className="logo-img" src={logo} alt="logo" style={{ width: "100px", height: "auto" }}/>
                    </Link>
                    <Link className="navbar-brand" to={isAdminRoute ? "/admin/products" : "/"}>
                        Good Print
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link 
                                    className={`nav-link ${location.pathname === "/" && !location.pathname.includes('/admin') ? "active" : ""}`} 
                                    to={location.pathname.includes('/admin') ? "/admin/products" : "/"}
                                >
                                    {location.pathname.includes('/admin') ? "Admin" : "Home"}
                                </Link>
                            </li>
                            {/* <li className="nav-item">
                                <Link className="nav-link active" to="/api-view">
                                    API View
                                </Link>
                            </li> */}
                            <li className="nav-item">
                                <Link 
                                    className={`nav-link ${location.pathname === "/" && !location.pathname.includes('/admin') ? "active" : ""}`} 
                                    to={location.pathname.includes('/admin') ? "/admin/reservas" : "/nosotros"}
                                >
                                    {location.pathname.includes('/admin') ? "Reservas" : "Nosotros"}
                                </Link>
                            </li>
                            <li className="nav-item dropdown me-2">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Productos y servicios
                                </a>
                                <ul className="dropdown-menu">
                                    <li>
                                        <a className="dropdown-item" href="#">
                                            Action
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="#">
                                            Another action
                                        </a>
                                    </li>
                                    <li>
                                        <hr className="dropdown-divider"></hr>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="#">
                                            Something else here
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            {/* Mostrar el botón de logout solo si hay token y la ruta es /admin/products */}
                            {token && location.pathname === '/admin/products' && (
                                <li className="nav-item mb-2 mb-lg-0">
                                    <Logout />
                                </li>
                            )}
                            {/* {token && location.pathname.includes('/admin') && (
                                <li className="nav-item mb-2 mb-lg-0">
                                        <Link to="/admin/products" className="btn btn-outline-success me-2 admin-btn">
                                            Admin
                                        </Link>
                                </li>
                            )} */}
                        </ul>
                        <form className="form d-flex" role="search">
                            <input
                                className="form-control me-2"
                                type="search"
                                placeholder="Buscar"
                                aria-label="Search"
                            />
                            <button className="btn btn-outline-success" type="submit">
                                Buscar
                            </button>
                        </form>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;

