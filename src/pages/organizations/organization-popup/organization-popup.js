import React, { useEffect, useRef, useState } from 'react';
import Popup from 'devextreme-react/popup';
import { DialogConstants } from '../../../constants/app-dialog-constant';
import { useScreenSize } from '../../../utils/media-query';
import ScrollView from 'devextreme-react/scroll-view';
import Form, { SimpleItem } from 'devextreme-react/form';
import Button from 'devextreme-react/button';

import './organization-popup.scss'
import { useAppData } from '../../../contexts/app-data';

const OrganizationPopup = ({ organizationId, callback }) => {

    const { getOrganizationOfficesAsync, postOrganizationAsync } = useAppData();
    const { isXSmall, isSmall } = useScreenSize();
    const [organization, setOrganization] = useState(null);

    const formRef = useRef(null);

    useEffect(() => {
        (async () => {
            if(organizationId) {
                const organizationOffices = await getOrganizationOfficesAsync(organizationId);
                const organizationOffice = organizationOffices.find(org => !!org);
                setOrganization({
                    id: organizationOffice.organizationId,
                    description: organizationOffice.description,
                    shortName: organizationOffice.shortName,
                });
            } else {
                setOrganization({
                    shortName: null,
                    description: null
                })
            }
        })()
    }, [getOrganizationOfficesAsync, organizationId])

    return (
        <Popup className={ 'app-popup track-map-popup' } title={ 'Организация' }
               dragEnabled={ false }
               visible={ true }
               showTitle={ true }
               showCloseButton={ true }
               onHiding={ () => {
                   callback({ modalResult: DialogConstants.ModalResults.Close, parametric: null });
               } }
               width={ isXSmall || isSmall ? '95%' : '35%' }
               height={ isXSmall || isSmall ? '95%' : '45%' }>
            <>
                <div className={ 'popup-form-container' }>
                    <ScrollView>
                        <div className={ 'dx-card responsive-paddings' }>
                            <Form className={ 'organization-popup-form' } ref={ formRef } formData={ organization }>

                                <SimpleItem dataField={ 'description' }
                                            isRequired={ true }
                                            label={ { location: 'top', showColon: true, text: 'Полное наименование ' } }
                                            editorType={ 'dxTextBox' }/>

                                <SimpleItem dataField={ 'shortName' }
                                            isRequired={ true }
                                            label={ { location: 'top', showColon: true, text: 'Сокращенное наименование ' } }
                                            editorType={ 'dxTextBox' }/>

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
