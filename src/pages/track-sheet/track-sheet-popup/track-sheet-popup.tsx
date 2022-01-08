import React, { useRef } from 'react';
import Popup from 'devextreme-react/popup';
import Form, { SimpleItem } from 'devextreme-react/form';
import Button from 'devextreme-react/button';
import { useScreenSize } from '../../../utils/media-query';
import { DialogConstants } from '../../../constants/app-dialog-constant';
import { TrackSheetPopupProps } from '../../../models/track-sheet-popup-props';

const TrackSheetPopup = ({ currentDate, callback }: TrackSheetPopupProps) => {

    const { isXSmall, isSmall } = useScreenSize();
    const formRef = useRef<Form>(null);

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
                                   />
                               </Form>
                               <div className={ 'popup-form-buttons-row' }>
                                   <div>&nbsp;</div>
                                   <Button type={ 'default' } text={ DialogConstants.ButtonCaptions.Ok } width={ DialogConstants.ButtonWidths.Normal }
                                           onClick={ () => {
                                               const formData = formRef.current?.instance.option('formData');
                                               callback({ modalResult: DialogConstants.ModalResults.Ok, parametric: formData });
                                           } }
                                   />
                                   <Button type={ 'normal' } text={ DialogConstants.ButtonCaptions.Cancel } width={ DialogConstants.ButtonWidths.Normal }
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
