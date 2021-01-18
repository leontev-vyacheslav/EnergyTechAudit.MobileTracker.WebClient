import React, { useEffect, useRef, useState } from 'react';
import Popup from 'devextreme-react/popup';
import { DialogConstants } from '../../../constants/app-dialog-constant';
import ScrollView from 'devextreme-react/scroll-view';
import Form, { SimpleItem } from 'devextreme-react/form';
import Button from 'devextreme-react/button';
import { useAppData } from '../../../contexts/app-data';
import { useScreenSize } from '../../../utils/media-query';

const OfficePopup = ({ editMode, organization, callback }) => {

    const { isXSmall, isSmall } = useScreenSize();
    const { getOfficeAsync, postOfficeAsync } = useAppData();

    const [currentOffice, setCurrentOffice] = useState(null);

    useEffect(() => {
        ( async () => {
            if (editMode && organization) {
                const office = await getOfficeAsync(organization.office.id);
                setCurrentOffice(office);
            } else {
                setCurrentOffice({
                    address: null
                })
            }
        } )()
    }, [editMode, getOfficeAsync, organization]);

    const formRef = useRef(null);

    return (
        <Popup className={ 'app-popup track-map-popup' } title={ 'Офис' }
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
                            <Form className={ 'organization-popup-form' } ref={ formRef } formData={ currentOffice }>
                                <SimpleItem
                                    dataField={ 'address' }
                                    isRequired={ true }
                                    label={ { location: 'top', showColon: true, text: 'Адрес' } }
                                    editorType={ 'dxTextBox' }/>
                            </Form>
                        </div>
                    </ScrollView>
                    <div className={ 'popup-form-buttons-row' }>
                        <div>&nbsp;</div>
                        <Button type={ 'default' } text={ DialogConstants.ButtonCaptions.Ok } width={  DialogConstants.ButtonWidths.Normal }
                                onClick={ async () => {
                                    let formData = formRef.current.instance.option('formData');
                                    const responseData = await postOfficeAsync(formData);
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

export default OfficePopup;
