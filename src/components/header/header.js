import React from 'react';
import Toolbar, { Item } from 'devextreme-react/toolbar';
import Button from 'devextreme-react/button';
import UserPanel from '../user-panel/user-panel';
import { Template } from 'devextreme-react/core/template';
import { ReactComponent as Eta24LogoSvg } from '../../assets/Core.Common.PreloaderLogo.Medium.SpringDepression.svg';

import './header.scss';
import { useAppSettings } from '../../contexts/app-settings';

export default ({ menuToggleEnabled, title, toggleMenu }) => {
    const { appSettingsData } = useAppSettings();
    return (
        <header className={ 'header-component' }>

            <Toolbar className={ 'header-toolbar' }>
                <Item visible={ menuToggleEnabled } location={ 'before' } widget={ 'dxButton' } cssClass={ 'menu-button' }>
                    <Button icon="menu" stylingMode="text" onClick={ toggleMenu }/>
                </Item>
                <Item
                    location={ 'before' }
                    cssClass={ 'header-title' }
                    text={ title }
                    visible={ !!title }
                    render={ () => {
                        return (
                            <div className={ 'header-title-logo-container' }>
                                <Eta24LogoSvg width={ 60 }/>
                                <div>{ title }</div>
                            </div>
                        );
                    } }
                />

                <Item location={ 'after' } locateInMenu={ 'auto' } menuItemTemplate={ 'hider' } >
                    <div style={ { fontSize: 14, marginTop: 3, fontWeight: 'bold', display: 'flex', flexDirection: 'column', lineHeight: 'initial', alignItems: 'flex-start' } }>
                        <div> { appSettingsData.workDate.toLocaleDateString('ru-RU') }</div>
                    </div>
                </Item>

                <Item location={ 'after' } locateInMenu={ 'auto' } menuItemTemplate={ 'userPanelTemplate' }>
                    <Button className={ 'user-button authorization' } height={ '100%' } stylingMode={ 'text' }>
                        <UserPanel menuMode={ 'context' }/>
                    </Button>
                </Item>

                <Template name={ 'userPanelTemplate' }>
                    <UserPanel menuMode={ 'list' }/>
                </Template>
                <Template name={ 'hider' }>
                    <div style={ { display: 'flex', alignItems: 'center', borderBottomColor: '#d8d8d8', borderBottomWidth: 1, borderBottomStyle: 'solid'  } } className={ 'dx-item-content dx-list-item-content' }>
                        <span className={ 'dx-icon dx-icon-info dx-list-item-icon' }/>
                        <div style={ { fontSize: 14, marginTop: 3, marginLeft: 15, display: 'flex', flexDirection: 'column', lineHeight: 'initial', alignItems: 'flex-start' } }>
                            <div> { appSettingsData.workDate.toLocaleDateString('ru-RU') }</div>
                        </div>
                    </div>
                </Template>
            </Toolbar>
        </header>
    )
};
