import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../style/navbar.css";
import logo from "../assets/Definitivo-ok.png";
import Logout from "../components/Logout";
import { Context } from "../store/AppContext";

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { actions } = useContext(Context);

    const isAdminRoute = location.pathname.startsWith("/admin");
    const token = localStorage.getItem("token");

    // Maneja click en logo o brand
    const handleLogoClick = () => {
        if (isAdminRoute) {
            navigate("/admin/products");
        } else {
            actions.resetCategory();
            navigate("/");
        }
    };

    return (
        <nav className="navbar container-fluid navbar-expand-lg">
            <div className="container-fluid">
                <button className="p-0 btn btn-link" onClick={handleLogoClick}>
                    <img className="logo-img" src={logo} alt="logo" style={{ width: "100px", height: "auto" }} />
                </button>

                <button className="navbar-brand btn btn-link" onClick={handleLogoClick}>
                    Good Print
                </button>

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
                                className={`nav-link ${location.pathname === "/" && !isAdminRoute ? "active" : ""}`}
                                to={isAdminRoute ? "/admin/products" : "/"}
                                onClick={() => {
                                    if (!isAdminRoute) actions.resetCategory();
                                }}
                            >
                                {isAdminRoute ? "Admin" : "Home"}
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === "/nosotros" || location.pathname === "/admin/reservas" ? "active" : ""}`}
                                to={isAdminRoute ? "/admin/reservas" : "/nosotros"}
                            >
                                {isAdminRoute ? "Reservas" : "Nosotros"}
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
                                <li><a className="dropdown-item" href="#">Categorias</a></li>
                                <li><a className="dropdown-item" href="#">Eventos especiales</a></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><a className="dropdown-item" href="#">Salir</a></li>
                            </ul>
                        </li>

                        {token && location.pathname === "/admin/products" && (
                            <li className="nav-item mb-2 mb-lg-0">
                                <Logout />
                            </li>
                        )}
                    </ul>

                    <form className="form d-flex" role="search">
                        <input className="form-control me-2" type="search" placeholder="Buscar" aria-label="Search" />
                        <button className="btn btn-outline-success" type="submit">Buscar</button>
                    </form>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
