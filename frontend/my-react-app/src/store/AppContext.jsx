import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import getState from "./flux";

// Crea el contexto
export const Context = React.createContext(null);

// Componente que envuelve el componente principal
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
        if (state.actions && typeof state.actions.getProducts === 'function') {
            state.actions.getProducts();
        } else {
            console.error("actions.getProducts is not a function");
        }
    }, [state.actions]);

    return (
        <Context.Provider value={state}>
            {children}
        </Context.Provider>
    );
};

// Define propTypes para AppContext
AppContext.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppContext;


