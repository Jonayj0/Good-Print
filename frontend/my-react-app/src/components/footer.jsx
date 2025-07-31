import { Link } from "react-router-dom";
import "../style/footer.css";

function Footer() {
    return (
        <div className="footer container-fluid">
        <ul className="nav justify-content-center">
            <li className="nav-item">
            <Link className="nav-link home" aria-current="page" to="/">
                Home
            </Link>
            </li>
            {/* <li className="nav-item">
            <Link className="nav-link api" to="/api-view">
                API View
            </Link>
            </li> */}
            <li className="nav-item">
            <Link className="nav-link active" to="/nosotros">
                Nosotros
            </Link>
            </li>
            <li className="nav-item">
            <a className="nav-link" href="#">
                Link
            </a>
            </li>
            <li className="nav-item">
            <Link className="nav-link" to="https://www.instagram.com/goodprintgp/" target="_blank" rel="noopener noreferrer" style={{ color: '#a1089c' }}>
                <i className="fa-brands fa-instagram fa-beat-fade"></i>
            </Link>
            </li>
        </ul>
        </div>
    );
}

export default Footer;
