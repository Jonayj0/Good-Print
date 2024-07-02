import React from "react";
import { Link } from "react-router-dom";
import "../style/nosotros.css";
import logo from "../assets/Definitivo-ok.png"

function Nosotros() {
  return (
    <div className="nosotros-container">
        <h1 className="titulo-nosotros text-center">¿Que hacemos en Good Print?</h1>
        <img className="logo-nosotros" src={logo} alt="logo" style={{ width: "50%", height: "auto" }}/>
    </div>
  );
}

export default Nosotros;