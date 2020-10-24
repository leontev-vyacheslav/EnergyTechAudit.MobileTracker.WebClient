import React from 'react';
import ScrollView from 'devextreme-react/scroll-view';
import appInfo from '../../app-info'
import './single-card.scss';
import { ReactComponent as Eta24LogoSvg } from '../../assets/Core.Common.PreloaderLogo.Medium.SpringDepression.svg';

export default ({ title, description, children }) => (
    <ScrollView height={ '100%' } width={ '100%' } className={ 'with-footer single-card' }>
        <div className={ 'dx-card content' }>
            <div className={ 'header' }>
                <div className={ 'header-title-logo-container' }>
                    <Eta24LogoSvg width={ 60 }/>
                    <div>{ appInfo.title }</div>
                </div>
                <div className={ 'title' }>{ title }</div>
                <div className={ 'description' }>{ description }</div>
            </div>
            { children }
        </div>
    </ScrollView>
);
