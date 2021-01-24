import React, { useEffect, useRef, useState } from 'react';
import { DialogConstants } from '../../../constants/app-dialog-constant';
import ScrollView from 'devextreme-react/scroll-view';
import Form, { SimpleItem } from 'devextreme-react/form';
import Button from 'devextreme-react/button';
import { useAppData } from '../../../contexts/app-data';
import AppModalPopup from '../../../components/app-modal-popup/app-modal-popup';

import './organization-popup.scss'

const OrganizationPopup = ({ editMode, organization, callback }) => {
    const { getOrganizationOfficesAsync, postOrganizationAsync } = useAppData();
    const [currentOrganization, setCurrentOrganization] = useState(null);

    const formRef = useRef(null);

    useEffect(() => {
        (async () => {
            if(editMode === true && organization) {
                const organizationOffices = await getOrganizationOfficesAsync(organization.organizationId);
                const organizationOffice = organizationOffices.find(org => !!org);
                setCurrentOrganization({
                    id: organizationOffice.organizationId,
                    description: organizationOffice.description,
                    shortName: organizationOffice.shortName,
                });
            } else {
                setCurrentOrganization({
                    shortName: null,
                    description: null
                })
            }
        })()
    }, [editMode, getOrganizationOfficesAsync, organization])

    return (
        <AppModalPopup title={ 'Сведения о пользователе' } onClose={ callback }>
            <div className={ 'popup-form-container' }>
                <ScrollView>
                    <div className={ 'dx-card responsive-paddings' }>
                        <Form className={ 'organization-popup-form' } ref={ formRef } formData={ currentOrganization }>

                            <SimpleItem dataField={ 'description' }
                                        isRequired={ true }
                                        label={ { location: 'top', showColon: true, text: 'Полное наименование ' } }
                                        editorType={ 'dxTextBox' }
                                        editorOptions={ {
                                            showClearButton: true
                                        } }
                            />

                            <SimpleItem dataField={ 'shortName' }
                                        isRequired={ true }
                                        label={ { location: 'top', showColon: true, text: 'Сокращенное наименование ' } }
                                        editorType={ 'dxTextBox' }
                                        editorOptions={ {
                                            showClearButton: true
                                        } }
                            />

                        </Form>
                    </div>
                </ScrollView>
                <div className={ 'popup-form-buttons-row' }>
                    <div>&nbsp;</div>
                    <Button type={ 'default' } text={ DialogConstants.ButtonCaptions.Ok } width={ DialogConstants.ButtonWidths.Normal }
                            onClick={ async () => {
                                let formData = formRef.current.instance.option('formData');
                                const responseData = await postOrganizationAsync(formData);
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
    );
}

export default OrganizationPopup;
