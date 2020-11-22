import React, { createContext, useCallback, useContext, useState, useRef } from 'react';

import { confirm } from 'devextreme/ui/dialog';
import { useAuth } from './auth';
import ReactDOMServer from 'react-dom/server';
import AppConstants from '../constants/app-constants';
import Loader from '../components/loader/loader';
import WorkDatePicker from '../components/work-date-picker/work-date-picker';

const SharedAreaContext = createContext({});
const useSharedArea = () => useContext(SharedAreaContext);

function SharedAreaProvider (props) {
    const { children } = props;
    const [isShowLoader, setIsShowLoader] = useState(false);
    const [isShowWorkDatePicker, setIsWorkDatePicker] = useState(false);
    const { signOut } = useAuth();
    const workDatePickerRef = useRef();

    const signOutWithConfirm = useCallback(() => {
        const confirmSignOutContent = () => {
            return (
                <div style={ { display: 'flex', alignItems: 'center' } }>
                    <i className={ 'dx-icon dx-icon-runner' } style={ { fontSize: '3em', color: AppConstants.colors.baseDarkgreyTextColor } }/>
                    <span>Действительно хотите <b>выйти</b> из приложения!</span>
                </div>
            );
        };
        const content = ReactDOMServer.renderToString(
            React.createElement(
                confirmSignOutContent,
                {}
            )
        );
        confirm(content, 'Выход').then((dialogResult) => {
            if (dialogResult) {
                signOut();
            }
        });
    }, [signOut]);

    const showWorkDatePicker = useCallback(() => {
        setIsWorkDatePicker(true);
        if (workDatePickerRef && workDatePickerRef.current) {
            workDatePickerRef.current.instance.open();
        }
    }, []);

    const hideWorkDatePicker = useCallback(() => {
        setIsWorkDatePicker(false);
    }, []);

    const hideLoader = useCallback(() => {
        setTimeout(() => {
            setIsShowLoader(false);
        }, 250);
    }, []);

    const showLoader = useCallback(() => {
        setIsShowLoader(true);
    }, []);

    return (
        <SharedAreaContext.Provider value={ { signOutWithConfirm, showWorkDatePicker, showLoader, hideLoader } } { ...props }>
            { isShowLoader ? <Loader/> : null }
            { isShowWorkDatePicker ? <WorkDatePicker ref={ workDatePickerRef } onClosed={ hideWorkDatePicker }/> : null }
            { children }
        </SharedAreaContext.Provider>
    );
}

export { useSharedArea, SharedAreaProvider };
