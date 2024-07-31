import React from "react";
import { Context } from "./AppContext";

export const injectContext = (PassedComponent) => {
    const StoreWrapper = (props) => {
        // Aquí deberías manejar el estado y las acciones
        // En esta configuración básica, asumimos que el estado se pasa a través del Context.Provider

        return (
            <Context.Provider value={React.useContext(Context)}>
                <PassedComponent {...props} />
            </Context.Provider>
        );
    };

    StoreWrapper.displayName = `InjectContext(${PassedComponent.displayName || PassedComponent.name || 'Component'})`;

    return StoreWrapper;
};
