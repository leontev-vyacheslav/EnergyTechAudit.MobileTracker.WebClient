import React, { useEffect, useRef, useState } from 'react';
import Popup from 'devextreme-react/popup';
import { useScreenSize } from '../../../utils/media-query';
import Form, { SimpleItem } from 'devextreme-react/form';
import Button from 'devextreme-react/button';
import { DialogConstants } from '../../../constants/dialog-constant';
import { useAppData } from '../../../contexts/app-data';
import ScrollView from 'devextreme-react/scroll-view';

const ExtendedUserInfoPopup = ({ userId, callback }) => {

    const { isXSmall, isSmall } = useScreenSize();
    const formRef = useRef(null);
    const { getExtendedUserInfoAsync, postExtendedUserInfoAsync, getOrganizationsAsync, getOfficesAsync  } = useAppData();

    const [extendedUserInfo, setExtendedUserInfo] = useState(null);
    const [offices, setOffices] = useState(null);
    const [organizations, setOrganizations] = useState(null);
    const [currentOrganization, setCurrentOrganization] = useState(null);

    useEffect(() => {
        ( async () => {
            let extendedUserInfo = await getExtendedUserInfoAsync(userId);
            extendedUserInfo = extendedUserInfo !== null ? { ...extendedUserInfo, ...{ organizationId: extendedUserInfo.office?.organizationId } } : null;
            const organizationId = extendedUserInfo !== null ? extendedUserInfo.office?.organizationId : null;

            const organizations = await getOrganizationsAsync();
            const offices = await  getOfficesAsync(organizationId);

            setOrganizations(organizations);
            setExtendedUserInfo(extendedUserInfo);

            if(extendedUserInfo && extendedUserInfo.officeId){
                setOffices(offices);
            }
        } )();
    }, [getExtendedUserInfoAsync, getOfficesAsync, getOrganizationsAsync, userId]);

    useEffect( () => {
        (async () => {
            if(currentOrganization) {
                const  offices = await  getOfficesAsync(currentOrganization);
                setOffices(offices);
            } else {
                setOffices([]);
                setExtendedUserInfo(previous => {
                    return { ...previous, ...{ officeId: null } }
                });
            }
        })();
    }, [currentOrganization, getOfficesAsync]);

    return (
        <Popup className={ 'app-popup track-map-popup' } title={ 'Сведения о пользователе' }
               dragEnabled={ false }
               visible={ true }
               showTitle={ true }
               showCloseButton={ true }
               onHiding={ () => {
                   callback({ modalResult: DialogConstants.ModalResults.Close, parametric: null });
               } }
               width={ isXSmall || isSmall ? '95%' : '35%' }
               height={ isXSmall || isSmall ? '95%' : '65%' }>
            <>
                <div className={ 'popup-form-container' }>
                    <ScrollView>
                        <div className={ 'dx-card responsive-paddings' }>
                            <Form ref={ formRef } formData={ extendedUserInfo }>
                                <SimpleItem dataField={ 'organizationId' }
                                            label={ { location: 'top', showColon: true, text: 'Организация' } }
                                            editorType={ 'dxSelectBox' }
                                            editorOptions=
                                                { {
                                                    dataSource: organizations,
                                                    showClearButton: true,
                                                    valueExpr: 'id',
                                                    displayExpr: 'shortName',
                                                    onValueChanged: (e) => {
                                                        setCurrentOrganization(e.value);
                                                    }
                                                } }
                                            />
                                <SimpleItem dataField={ 'officeId' }
                                            label={ { location: 'top', showColon: true, text: 'Офис' } }
                                            editorType={ 'dxSelectBox' }
                                            editorOptions=
                                                { {
                                                    dataSource: offices,
                                                    valueExpr: 'id',
                                                    displayExpr: 'address',
                                                } }
                                             />

                                <SimpleItem dataField={ 'firstName' }
                                            isRequired={ true }
                                            label={ { location: 'top', showColon: true, text: 'Имя' } }
                                            editorType={ 'dxTextBox' }/>
                                <SimpleItem dataField={ 'lastName' }
                                            isRequired={ true }
                                            label={ { location: 'top', showColon: true, text: 'Фамилия' } }
                                            editorType={ 'dxTextBox' }/>
                                <SimpleItem dataField={ 'birthDate' }
                                            label={ { location: 'top', showColon: true, text: 'Дата рождения' } }
                                            editorType={ 'dxDateBox' } editorOptions=
                                                { {
                                                    type: 'date',
                                                    pickerType: 'rollers',
                                                } }
                                />
                                <SimpleItem dataField={ 'phone' }
                                            label={ { location: 'top', showColon: true, text: 'Телефон' } }
                                            helpText="Пример: +7(111)111-1111"
                                            editorType={ 'dxTextBox' } editorOptions={ { mask: '+7 (000) 000-0000' } }
                                />
                            </Form>
                        </div>
                    </ScrollView>
                    <div className={ 'popup-form-buttons-row' }>
                        <div>&nbsp;</div>
                        <Button type={ 'default' } text={ DialogConstants.ButtonCaptions.Ok } width={  DialogConstants.ButtonWidths.Normal }
                                onClick={ async () => {
                                    let formData = formRef.current.instance.option('formData');
                                    formData = { ...formData, ...{ id: userId } };
                                    const responseData = await postExtendedUserInfoAsync(formData);
                                    callback({ modalResult: DialogConstants.ModalResults.Ok, data: responseData !== null ? formData : null });
                                } }
                        />
                        <Button type={ 'normal' } text={ DialogConstants.ButtonCaptions.Cancel } width={ DialogConstants.ButtonWidths.Normal  }
                                onClick={ () => {
                                    callback({ modalResult: DialogConstants.ModalResults.Cancel, data: null });
                                } }
                        />
                    </div>
                </div>
            </>
        </Popup>
    );
};

export default ExtendedUserInfoPopup;
