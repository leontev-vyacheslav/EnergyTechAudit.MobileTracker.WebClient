import React from 'react';
import ScrollView from 'devextreme-react/scroll-view';
import { ReactComponent as AppLogo } from '../../assets/app-logo.svg';
import AppConstants from '../../constants/app-constants';
import './single-card.scss';

export default ({ title, description, children }) => (
    <ScrollView  height={ '100%' } width={ '100%' } className={ 'with-footer single-card' }>
        <div className={ 'dx-card content' }>
            <div className={ 'header' }>
                <div className={ 'header-title-logo-container' }>
                    <AppLogo width={ 60 }/>
                    <div>{ AppConstants.appInfo.title }</div>
                </div>
                <div className={ 'title' }>{ title }</div>
                <div className={ 'description' }>{ description }</div>
            </div>
            { children }
        </div>
    </ScrollView>
);
