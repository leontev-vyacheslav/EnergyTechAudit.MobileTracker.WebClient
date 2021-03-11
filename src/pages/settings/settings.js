import React from 'react';
import { SettingsIcon } from '../../constants/app-icons';
import PageHeader from '../../components/page-header/page-header';
import SettingsForm from './settings-form';

export default () => {
    return (
        <>
            <PageHeader caption={ 'Настройки' }>
                <SettingsIcon size={ 30 }/>
            </PageHeader>
            <div className={ 'content-block' }>
                <div className={ 'dx-card responsive-paddings' }>
                    <SettingsForm style={ { width: 400 } }/>
                </div>
            </div>
        </>
    );
};
