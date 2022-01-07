import React from 'react';
import './footer.scss';
import { useAppSettings } from '../../contexts/app-settings';
import { AppSettingsContextModel } from '../../models/app-settings-context';

export default ({ ...rest }) => {
    const { appSettingsData: { isShowFooter: isShowFooter } }: AppSettingsContextModel = useAppSettings();
    return isShowFooter ? <footer className={ 'footer' } { ...rest } /> : null;
};
