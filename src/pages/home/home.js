import React from 'react';
import {ReactComponent as Eta24LogoSvg} from '../../assets/Core.Common.PreloaderLogo.Medium.SpringDepression.svg';
import appInfo from '../../app-info';

import './home.scss';

export default () => (
    <React.Fragment>
        <h2 className={ 'content-block' }>Главная</h2>
        <div className={ 'content-block' }>
            <div className={ 'dx-card responsive-paddings home-page-content' }>
                <div className={ 'logos-container' }>
                    <Eta24LogoSvg width={ 100 }/>

                    <div>{ appInfo.companyName }</div>
                </div>

                <p>
                    Благодарим Вас за использование программного комплекса&nbsp;
                    <span style={ {fontWeight: 'bold'} }>{ appInfo.title }</span>.
                </p>

                <p>
          <span>
            Этот программный комплекс предназначен для регистрации технической информации о местоположении, возвышении
            над уровнем моря, направлении движения, скорости и пройденных расстояний на основе данных передаваемых от
            мобильного телефона с установленным клиентским программным обеспечением
          </span>
                    &nbsp;
                    <a href={ 'https://eta24.ru' } target={ '_blank' } rel={ 'noopener noreferrer' }>
                        ETA24™ Mobile Tracker
                    </a>
                </p>

                <p>
          <span>
            Для получения более подробной технической информацией относительно{ ' ' }
              <span style={ {fontWeight: 'bold'} }>{ appInfo.title }</span> обращайтесь в офисы компании{ ' ' }
          </span>
                    <a href="https://ic-eta.ru" target="_blank" rel="noopener noreferrer">
                        { appInfo.companyName }
                    </a>
                    <span>.</span>
                </p>
            </div>
        </div>
    </React.Fragment>
);
