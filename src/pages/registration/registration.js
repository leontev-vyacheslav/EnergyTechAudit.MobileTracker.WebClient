import React, { useEffect, useRef, useState } from 'react';
import AppConstants from '../../constants/app-constants';
import { SingleCard } from '../../layouts';
import { useAuth } from '../../contexts/auth';
import Button from 'devextreme-react/button';
import Form, { SimpleItem } from 'devextreme-react/form';
import { useAppData } from '../../contexts/app-data';
import { useScreenSize } from '../../utils/media-query';

const Registration = () => {
    const { user } = useAuth();
    const { isXSmall, isSmall } = useScreenSize();
    const { getOrganizationsAsync, getAssignOrganizationAsync } = useAppData();

    const [organizations, setOrganizations] = useState(null);
    const [userVerificationData, setUserVerificationData] = useState(null);
    const [currentUserOrganization] = useState({ organizationId: null });
    const [assignedOrganization, setAssignedOrganization] = useState(null);

    const formRef = useRef(null);

    useEffect(() => {
        const isConfirm = window.location.hash.includes('confirm-registration');
        if (isConfirm) {

            const [, rawVerificationData] = location.hash.split('userVerificationData=');
            if (rawVerificationData) {
                try {
                    const verificationData = JSON.parse(atob(rawVerificationData) ?? 'null');
                    setUserVerificationData(verificationData);
                }
                catch {
                    setUserVerificationData(null)
                }
            }
        }
    }, []);

    useEffect(() => {
        ( async () => {
            if(userVerificationData) {
                const organizations = await getOrganizationsAsync();
                setOrganizations(organizations);
            }
        } )();
    }, [getOrganizationsAsync, userVerificationData]);

    const UnregisteredContent = () => {
        return (
            <div className={ 'description' } style={ { textAlign: 'justify', fontSize: 16, lineHeight: 2 } }>
                <div>Учетная запись пользователя <b>не была зарегистрирована</b>!</div>
                <div style={ { marginTop: 20 } }>Обратитесь к администраторам системы!</div>
            </div>
        );
    };

    const RegisteredContent = () => {
        return assignedOrganization !== null ?
            (
                <div className={ 'description' } style={ { textAlign: 'justify', fontSize: 16, lineHeight: 2 } }>
                    <div style={ { height: 300 } }>
                        Учетная запись пользователя { userVerificationData.email} была успешно присоединена к организации:
                        <br/><div style={ { marginTop: 30 } }><b>{assignedOrganization.description}</b></div>
                    </div>
                </div>
            ) :
            (
            <div className={ 'description' } style={ { textAlign: 'justify', fontSize: 16, lineHeight: 2 } }>
                <div>Учетная запись пользователя <b>{ userVerificationData.email }</b> была <b>уже успешно зарегистрирована</b>!</div>
                <div style={ { marginTop: 20 } }>Выберите группу/организацию, к которой будет присоединена учетная запись.</div>
                <div className={ 'popup-form-container' }>

                    <Form
                        formData={ currentUserOrganization }
                        validationGroup="adminUserValidationGroup"
                        ref={ formRef }
                    >
                        <SimpleItem
                            dataField={ 'organizationId' }
                            label={ { location: 'top', showColon: true, text: 'Организация' } }
                            editorType={ 'dxSelectBox' }
                            validationRules={ [{ type: 'required' }] }
                            editorOptions=
                                { {
                                    width: !user || isSmall || isXSmall ? '100%' : 'calc(100vw / 3)',
                                    dataSource: organizations,
                                    showClearButton: true,
                                    valueExpr: 'id',
                                    displayExpr: 'shortName',
                                } }
                        />
                    </Form>
                    <div className={ 'popup-form-buttons-row' }>
                        <div>&nbsp;</div>
                        <Button
                            type={ 'default' } text={ 'Присоединить' }
                            onClick={ async () => {
                                const validationGroupResult = formRef.current.instance.validate();
                                if (!validationGroupResult.isValid) {
                                    validationGroupResult.brokenRules.find(() => true).validator.focus()
                                } else {
                                    const formData = formRef.current.instance.option('formData');
                                    const response = await getAssignOrganizationAsync({ ...userVerificationData, ...formData });
                                    setAssignedOrganization(response);
                                }
                            } }
                        />
                    </div>
                    <p>
                        Finally, some of our services give you access to content that belongs to other people or organizations — for example,
                        a store owner’s description of their own business, or a newspaper article displayed in ETA News.
                        You may not use this content without that person or organization’s permission, or as otherwise allowed by law.
                        The views expressed in other people or organizations’ content are theirs, and don’t necessarily reflect ETA’s views.
                    </p>
                </div>
            </div>
        );
    };

    const InnerContent = () => {
        return userVerificationData && organizations ? <RegisteredContent /> : <UnregisteredContent />;
    };

    return user ?
        <>
            <h2 className={ 'content-block' }>Регистрация пользователя</h2>
            <div className={ 'content-block' }>
                <div style={ { lineHeight: 2, height: 'calc(100vh - 250px)' } } className={ 'dx-card responsive-paddings home-page-content' }>
                    <div className={ 'logos-container' }>
                        <div>{ AppConstants.appInfo.companyName }</div>
                    </div>
                    <div style={ { marginLeft: 10, marginTop: 10 } }>
                        <InnerContent/>
                    </div>
                </div>
            </div>
        </>
        :
        <div className={ 'registration' }>
            <SingleCard title={ 'Регистрация пользователя' }>
                <InnerContent/>
            </SingleCard>
        </div>
    ;
}

export default Registration;
