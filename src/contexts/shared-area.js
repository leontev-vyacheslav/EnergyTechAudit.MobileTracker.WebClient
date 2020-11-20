import React, { createContext, useContext, useRef } from 'react';

const SharedAreaContext = createContext({});
const useSharedArea = () => useContext(SharedAreaContext);

function SharedAreaProvider (props) {
    const workDatePickerRef = useRef();

    return <SharedAreaContext.Provider value={ { workDatePickerRef } } { ...props } />;
}

export { useSharedArea, SharedAreaProvider };
