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
    const { getExtendedUserInfoAsync, postExtendedUserInfoAsync } = useAppData();
    const [extendedUserInfo, setExtendedUserInfo] = useState(null);

    useEffect(() => {
        ( async () => {
            const extendedUserInfo = await getExtendedUserInfoAsync(userId);
            setExtendedUserInfo(extendedUserInfo);
        } )();
    }, [getExtendedUserInfoAsync, userId]);

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
                                    const formData = formRef.current.instance.option('formData');
                                    await postExtendedUserInfoAsync({ ...formData, ...{ id: userId } });
                                    callback({ modalResult: DialogConstants.ModalResults.Ok, data: formData });
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
