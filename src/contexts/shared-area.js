import React, { createContext, useContext, useRef } from 'react';

const SharedAreaContext = createContext({});
const useSharedArea = () => useContext(SharedAreaContext);

function SharedAreaProvider (props) {
    const workDatePickerRef = useRef();
    const loaderRef = useRef();

    return <SharedAreaContext.Provider value={ { workDatePickerRef, loaderRef } } { ...props } />;
}

export { useSharedArea, SharedAreaProvider };
