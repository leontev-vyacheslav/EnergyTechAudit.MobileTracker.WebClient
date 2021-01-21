import React, { useEffect, useRef, useState } from 'react';
import Popup from 'devextreme-react/popup';
import { DialogConstants } from '../../../constants/app-dialog-constant';
import { useScreenSize } from '../../../utils/media-query';
import ScrollView from 'devextreme-react/scroll-view';
import Form, { SimpleItem } from 'devextreme-react/form';
import Button from 'devextreme-react/button';

import './organization-popup.scss'
import { useAppData } from '../../../contexts/app-data';

const OrganizationPopup = ({ editMode, organization, callback }) => {

    const { getOrganizationOfficesAsync, postOrganizationAsync } = useAppData();
    const { isXSmall, isSmall } = useScreenSize();
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
        <Popup className={ 'app-popup track-map-popup' } title={ 'Организация' }
               dragEnabled={ false }
               visible={ true }
               showTitle={ true }
               showCloseButton={ true }
               onHiding={ () => {
                   callback({ modalResult: DialogConstants.ModalResults.Close, parametric: null });
               } }
               width={ isXSmall || isSmall ? '95%' : '40%' }
               height={ isXSmall || isSmall ? '95%' : '450' }>
            <>
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
                        <Button type={ 'default' } text={ DialogConstants.ButtonCaptions.Ok } width={  DialogConstants.ButtonWidths.Normal }
                                onClick={ async () => {
                                    let formData = formRef.current.instance.option('formData');
                                    const responseData = await postOrganizationAsync(formData);
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
}

export default OrganizationPopup;
