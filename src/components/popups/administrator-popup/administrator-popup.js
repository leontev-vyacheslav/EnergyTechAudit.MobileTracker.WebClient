import React, { useEffect, useRef, useState } from 'react';
import AppModalPopup from '../app-modal-popup/app-modal-popup';
import ScrollView from 'devextreme-react/scroll-view';
import Form, { SimpleItem } from 'devextreme-react/form';
import Button from 'devextreme-react/button';
import { DialogConstants } from '../../../constants/app-dialog-constant';
import { useAppData } from '../../../contexts/app-data';

const AdministratorPopup = ({ editMode, administrator, callback }) => {

    const [currentAdministrator, setCurrentAdministrator] = useState(null);
    const [organizations, setOrganizations] = useState(null);
    const { getAdminAsync, postAdminAsync, getOrganizationsAsync } = useAppData();

    const formRef = useRef(null);

    useEffect(() => {
        (async () => {
            if(editMode === true && administrator) {
                const currentAdministrator = await getAdminAsync(administrator.id);
                const organizations = await getOrganizationsAsync();
                console.log(currentAdministrator);
                console.log(organizations);
                setOrganizations(organizations);
                setCurrentAdministrator(currentAdministrator);
            }
        }) ();
    }, [administrator, editMode, getAdminAsync, getOrganizationsAsync]);

    return currentAdministrator ? (
        <AppModalPopup onClose={ callback } title={ 'Администратор' }>
            <div className={ 'popup-form-container' }>
                <ScrollView>
                    <Form className={ 'organization-popup-form responsive-paddings' } ref={ formRef } formData={ currentAdministrator }>

                        <SimpleItem dataField={ 'organizationId' }
                                    label={ { location: 'top', showColon: true, text: 'Организация' } }
                                    editorType={ 'dxSelectBox' }
                                    editorOptions=
                                        { {
                                            dataSource: organizations,
                                            showClearButton: true,
                                            valueExpr: 'id',
                                            displayExpr: 'shortName',
                                        } }
                        />

                        <SimpleItem
                            dataField={ 'email' }
                            label={ { location: 'top', showColon: true, text: 'Электронная почта' } }
                            editorType={ 'dxTextBox' }
                        />

                        <SimpleItem
                            dataField={ 'editablePassword' }
                            label={ { location: 'top', showColon: true, text: 'Пароль' } }
                            editorType={ 'dxTextBox' }
                            editorOptions={
                                {
                                    mode : 'password',
                                    readOnly: true,
                                    placeholder: 'Новый пароль',
                                    inputAttr: { autocomplete: 'new-password' },
                                    onFocusIn: (e) => {
                                        e.component.option('readOnly', false)
                                    }
                                }
                            }
                        />

                        <SimpleItem
                            dataField={ 'isActive' }
                            label={ { location: 'top', showColon: true, text: 'Активный' } }
                            editorType={ 'dxCheckBox' }
                        />
                    </Form>
                </ScrollView>
                <div className={ 'popup-form-buttons-row' }>
                    <div>&nbsp;</div>
                    <Button type={ 'default' } text={ DialogConstants.ButtonCaptions.Ok } width={ DialogConstants.ButtonWidths.Normal }
                            onClick={ async () => {
                                let formData = formRef.current.instance.option('formData');
                                const responseData = await postAdminAsync(formData);
                                callback({ modalResult: DialogConstants.ModalResults.Ok, data: responseData !== null ? formData : null });
                            } }
                    />
                    <Button type={ 'normal' } text={ DialogConstants.ButtonCaptions.Cancel } width={ DialogConstants.ButtonWidths.Normal }
                            onClick={ () => {
                                callback({ modalResult: DialogConstants.ModalResults.Cancel, data: null });
                            } }
                    />
                </div>
            </div>
        </AppModalPopup>
    ) : null;
}

export default AdministratorPopup;
