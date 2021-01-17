import React, { useEffect, useRef } from 'react';
import Popup from 'devextreme-react/popup';
import { DialogConstants } from '../../../constants/app-dialog-constant';
import { useScreenSize } from '../../../utils/media-query';
import ScrollView from 'devextreme-react/scroll-view';
import Form, { SimpleItem } from 'devextreme-react/form';
import Button from 'devextreme-react/button';

const OrganizationPopup = ({ organizationId, callback }) => {

    const { isXSmall, isSmall } = useScreenSize();
    const formRef = useRef(null);

    useEffect(() => {
        if(organizationId) {
//
        }
    }, [organizationId])

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
               height={ isXSmall || isSmall ? '95%' : '65%' }>
            <>
                <div className={ 'popup-form-container' }>
                    <ScrollView>
                        <div className={ 'dx-card responsive-paddings' }>
                            <Form ref={ formRef } formData={ null }>

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
                                    callback({ modalResult: DialogConstants.ModalResults.Ok, data: null });
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
