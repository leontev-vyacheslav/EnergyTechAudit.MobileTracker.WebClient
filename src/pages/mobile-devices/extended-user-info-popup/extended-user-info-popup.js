import React, { useEffect, useRef, useState } from 'react';
import Popup from 'devextreme-react/popup';
import { useScreenSize } from '../../../utils/media-query';
import Form, { SimpleItem } from 'devextreme-react/form';
import Button from 'devextreme-react/button';
import { DialogConstants } from '../../../constants/dialog-constant';
import { useAppData } from '../../../contexts/app-data';
import ScrollView from 'devextreme-react/scroll-view';
import DataSource from 'devextreme/data/data_source';

const ExtendedUserInfoPopup = ({ userId, callback }) => {

    const { isXSmall, isSmall } = useScreenSize();
    const formRef = useRef(null);
    const { getExtendedUserInfoAsync, postExtendedUserInfoAsync, getOfficesAsync  } = useAppData();
    const [extendedUserInfo, setExtendedUserInfo] = useState(null);
    const [offices, setOffices] = useState(null);

    useEffect(() => {
        ( async () => {
            const extendedUserInfo = await getExtendedUserInfoAsync(userId);

            const offices = await getOfficesAsync();

            const dataSource = new DataSource({
                store: {
                    data: offices,
                    type: 'array',
                    key: 'id'
                },
                group: 'organizationShortName'
            });

            setOffices(dataSource);
            setExtendedUserInfo(extendedUserInfo);
        } )();
    }, [getExtendedUserInfoAsync, getOfficesAsync, userId]);

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

                                <SimpleItem dataField={ 'officeId' }
                                            isRequired={ true }
                                            label={ { location: 'top', showColon: true, text: 'Офис организации' } }
                                            editorType={ 'dxSelectBox' }
                                            editorOptions=
                                                { {
                                                    dataSource: offices,
                                                    grouped: true,
                                                    valueExpr: 'id',
                                                    displayExpr: 'address'
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
