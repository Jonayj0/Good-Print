import React, { useState, useMemo } from "react";
import PropTypes from 'prop-types';
import getState from "./flux";

export const Context = React.createContext(null);

const AppContext = ({ children }) => {
    const [state, setState] = useState(
        getState({
            getStore: () => state.store,
            getActions: () => state.actions,
            setStore: (updatedStore) =>
                setState((prevState) => ({
                    store: { ...prevState.store, ...updatedStore },
                    actions: prevState.actions, // Mantener referencia
                })),
        })
    );

    const actions = useMemo(() => state.actions, [state.actions]);

    return (
        <Context.Provider value={{ store: state.store, actions }}>
            {children}
        </Context.Provider>
    );
};

AppContext.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppContext;
