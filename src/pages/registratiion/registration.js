import React from 'react';
import AppConstants from '../../constants/app-constants';
import { SingleCard } from '../../layouts';
import { useAuth } from '../../contexts/auth';

const Registration = () => {
    const { user } = useAuth();
    const isConfirm = window.location.hash.includes('confirm-registration');
    let userVerificationData = null;
    if (isConfirm) {
        userVerificationData = atob(location.hash.split('userVerificationData=')[1]) ?? '';
    }
    const InnerContent = () => {
        return isConfirm ? (
            <div className={ 'description' } style={ { textAlign: 'justify', fontSize: 16, height: 200, lineHeight: 2 } }>
                <div>Учетная запись пользователя <b>{ userVerificationData }</b> была <b>успешно зарегистрирована</b>!</div>
                <div style={ { marginTop: 20 } } >Обратитесь к администраторам системы для ее подтверждения!</div>
            </div>
        ) : (
            <div className={ 'description' } style={ { textAlign: 'justify', fontSize: 16, height: 200, lineHeight: 2 } }>
                <div>Учетная запись пользователя <b>не была зарегистрирована</b>!</div>
                <div style={ { marginTop: 20 } }>Обратитесь к администраторам системы!</div>
            </div>
        );
    }
    return user ? (
            <>
                <h2 className={ 'content-block' }>Регистрация пользователя</h2>
                <div className={ 'content-block' }>
                    <div style={ { lineHeight: 2 } } className={ 'dx-card responsive-paddings home-page-content' }>
                        <div className={ 'logos-container' }>
                            <div>{ AppConstants.appInfo.companyName }</div>
                        </div>
                        <div style={ { marginLeft: 10, marginTop: 10 } }>
                            <InnerContent/>
                        </div>
                    </div>
                </div>
            </>
        ) :
        (
            <div className={ 'registration' }>
                <SingleCard title={ 'Регистрация пользователя' }>
                    <InnerContent/>
                </SingleCard>
            </div>
        );
}

export default Registration;
