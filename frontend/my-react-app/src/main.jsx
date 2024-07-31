import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import AppContext from "./store/AppContext"; // Asegúrate de que AppContext esté importado correctamente
import "./index.css";

// Envuelve App con AppContext
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppContext> {/* Aquí envuelve el App con AppContext */}
      <App />
    </AppContext>
  </React.StrictMode>
);


