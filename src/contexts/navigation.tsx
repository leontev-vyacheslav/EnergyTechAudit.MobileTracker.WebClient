import React, { createContext, FunctionComponent, useContext, useEffect, useState } from 'react';
import { NavigationContextModel, NavigationDataModel } from '../models/navigation-context';
import { AppBaseProviderProps } from '../models/app-base-provider-props';

const NavigationContext = createContext<NavigationContextModel>({} as NavigationContextModel);
const useNavigation = () => useContext(NavigationContext);

function NavigationProvider (props: AppBaseProviderProps) {
    const [navigationData, setNavigationData] = useState<NavigationDataModel>({} as NavigationDataModel);

    return (
        <NavigationContext.Provider
            value={ { navigationData, setNavigationData } }
            { ...props }
        />
    );
}

function withNavigationWatcher (Component: FunctionComponent) {
    return function (props: any) {
        const { path } = props.match;
        const { setNavigationData } = useNavigation();

        useEffect(() => {
            setNavigationData({ currentPath: path });
        }, [path, setNavigationData]);

        return React.createElement(Component, props);
    }
}

export {
    NavigationProvider,
    useNavigation,
    withNavigationWatcher
}
