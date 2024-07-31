import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import getState from "./flux";

export const Context = React.createContext(null);

const AppContext = ({ children }) => {
    const [state, setState] = useState(
        getState({
            getStore: () => state.store,
            getActions: () => state.actions,
            setStore: (updatedStore) =>
                setState({
                    store: { ...state.store, ...updatedStore },
                    actions: { ...state.actions },
                }),
        })
    );

    useEffect(() => {
        // Solo ejecuta `getProducts` una vez al montar el componente
        if (state.actions && typeof state.actions.getProducts === 'function') {
            state.actions.getProducts();
        } else {
            console.error("actions.getProducts is not a function");
        }
    }, []); // Dependencias vacías

    return (
        <Context.Provider value={state}>
            {children}
        </Context.Provider>
    );
};

AppContext.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppContext;
