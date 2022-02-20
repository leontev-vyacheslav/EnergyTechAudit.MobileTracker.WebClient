import React from 'react';
import AppConstants from '../../constants/app-constants';
import './home.scss';
import { HomeIcon } from '../../constants/app-icons';
import PageHeader from '../../components/page-header/page-header';

const Home = () => {
    return (
        <>
            <PageHeader caption={ 'Главная' }>
                <HomeIcon size={ AppConstants.headerIconSize }/>
            </PageHeader>
            <div className={ 'content-block' }>
                <div className={ 'dx-card responsive-paddings home-page-content' }>
                    <div className={ 'logos-container' }>
                        <div>{ AppConstants.appInfo.companyName }</div>
                    </div>
                    <p>
                        Благодарим Вас за использование программного комплекса&nbsp;
                        <span style={ { fontWeight: 'bold' } }>{ AppConstants.appInfo.title }</span>.
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
                          <span style={ { fontWeight: 'bold' } }>{ AppConstants.appInfo.title }</span> обращайтесь в офисы компании{ ' ' }
                      </span>
                        <a href="https://ic-eta.ru" target="_blank" rel="noopener noreferrer">
                            { AppConstants.appInfo.companyName }
                        </a>
                        <span>.</span>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Home;
