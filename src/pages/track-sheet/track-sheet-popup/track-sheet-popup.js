import React, { useRef } from 'react';
import Popup from 'devextreme-react/popup';
import Form, { SimpleItem } from 'devextreme-react/form';
import Button from 'devextreme-react/button';
import { useScreenSize } from '../../../utils/media-query';
import { DialogConstants } from '../../../constants/dialog-constant';

const TrackSheetPopup = ({ currentDate, callback }) => {

    const { isXSmall, isSmall } = useScreenSize();
    const formRef = useRef(null);

    return (
        <Popup className={ 'app-popup' } title={ 'Период' }
               dragEnabled={ false }
               visible={ true }
               showTitle={ true }
               showCloseButton={ true }
               onHiding={ () => {
                   callback({ modalResult: DialogConstants.ModalResults.Close, parametric: null });
               } }
               width={ isXSmall || isSmall ? '95%' : 400 }
               height={  200 }
               contentRender={ () => {
                   return (
                       <>
                           <div className={ 'popup-form-container' }>
                               <Form ref={ formRef } >
                                   <SimpleItem
                                       label={ { text: 'Текущий месяц:' } }
                                       editorOptions={ {
                                           displayFormat: 'monthAndYear',
                                           adaptivityEnabled: true,
                                           pickerType: 'rollers',
                                           calendarOptions: {
                                               maxZoomLevel: 'year',
                                               minZoomLevel: 'decade',
                                               zoomLevel: 'year'
                                           },
                                           value: currentDate
                                       } }
                                       dataField={ 'currentDate' }
                                       editorType={ 'dxDateBox' }
                                       value={ currentDate }
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
                   );
               } }>
        </Popup>
    );
}

export default TrackSheetPopup;
