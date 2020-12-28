import React, { useRef } from 'react';
import Popup from 'devextreme-react/popup';
import { useScreenSize } from '../../../utils/media-query';
import Form, { SimpleItem } from 'devextreme-react/form';
import Button from 'devextreme-react/button';
import { DialogConstants } from '../../../constants/dialog-constant';


const ExtendedUserInfoPopup = ({ data,  callback }) => {

    const { isXSmall, isSmall } = useScreenSize();
    const formRef = useRef(null);

    return (
        <Popup className={ 'app-popup track-map-popup' } title={ 'Сведения о пользователе' }
               dragEnabled={ false }
               visible={ true }
               showTitle={ true }
               showCloseButton={ true }
               onHiding={ () => {
                   callback({ modalResult: DialogConstants.ModalResults.Close, parametric: null });
               } }
               width={ isXSmall || isSmall ? '95%' : '30%' }
               height={ isXSmall || isSmall ? '95%' : '60%' }>
            <>
                <div className={ 'popup-form-container' }>
                    <Form ref={ formRef } formData={ data }>
                        <SimpleItem dataField={ 'firstName' } label={ { location: 'top', showColon: true, text: 'Имя' } } editorType={ 'dxTextBox' }/>
                        <SimpleItem dataField={ 'lastName' } label={ { location: 'top', showColon: true, text: 'Фамилия' } } editorType={ 'dxTextBox' }/>
                        <SimpleItem dataField={ 'birthDate' }
                                    label={ { location: 'top', showColon: true, text: 'Дата рождения' } }
                                    editorType={ 'dxDateBox' } editorOptions=
                                        { {
                                            type: 'date',
                                            pickerType: 'rollers',
                                        } }
                        />
                    </Form>

                <div className={ 'popup-form-buttons-row' }>
                    <div>&nbsp;</div>
                    <Button type={ 'default' } text={ 'Ok' } width={ 95 }
                            onClick={ () => {
                                const formData = formRef.current.instance.option('formData');
                                callback({ modalResult: DialogConstants.ModalResults.Ok, parametric: formData  });
                            } }
                    />
                    <Button type={ 'normal' } text="Отмена" width={ 95 }
                            onClick={ () => {
                                callback({ modalResult: DialogConstants.ModalResults.Cancel, parametric: null });
                            } }
                    />
                </div>
                </div>
            </>
        </Popup>
    );
};

export default ExtendedUserInfoPopup;
