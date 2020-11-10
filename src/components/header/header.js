import React from 'react';
import Toolbar, { Item } from 'devextreme-react/toolbar';
import Button from 'devextreme-react/button';
import UserPanel from '../user-panel/user-panel';
import './header.scss';
import { Template } from 'devextreme-react/core/template';
import { ReactComponent as Eta24LogoSvg } from '../../assets/Core.Common.PreloaderLogo.Medium.SpringDepression.svg';

export default ({ menuToggleEnabled, title, toggleMenu }) => (
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
            <Item location={ 'after' } locateInMenu={ 'auto' } menuItemTemplate={ 'userPanelTemplate' }>
                <Button className={ 'user-button authorization' } width={ 200 } height={ '100%' } stylingMode={ 'text' }>
                    <UserPanel menuMode={ 'context' }/>
                </Button>
            </Item>
            <Template name={ 'userPanelTemplate' }>
                <UserPanel menuMode={ 'list' }/>
            </Template>
        </Toolbar>
    </header>
);
