import React from 'react';
import './footer.scss';
import { useAppSettings } from '../../contexts/app-settings';

const Footer = ({ ...rest }) => {
    const { appSettingsData: { isShowFooter: isShowFooter } } = useAppSettings();
    return isShowFooter ? <footer className={ 'footer' } { ...rest } /> : null;
};

export default Footer;
