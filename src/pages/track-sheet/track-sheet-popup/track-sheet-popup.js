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
        <Popup className={ 'track-map-popup' } title={ 'Период' }
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
                           <div style={ { display: 'grid', height: '100%', gridTemplateRows: '1fr 30px' } }>
                               <Form ref={ formRef } onFieldDataChanged = { null } >
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
                               <div style={ { display: 'grid', gridTemplateColumns: '1fr 100px 100px', gap: 10 } }>
                                   <div>&nbsp;</div>
                                   <Button
                                       style={ { justifySelf: 'right', alignSelf: 'end' } }
                                       text={ 'Ok' }
                                       width={ 95 }
                                       onClick={ () => {
                                           const formData = formRef.current.instance.option('formData');
                                           callback({ modalResult: DialogConstants.ModalResults.Ok, parametric: formData  });
                                       } }
                                       type={ 'default' }
                                   />
                                   <Button
                                       style={ { justifySelf: 'right', alignSelf: 'end' } }
                                       width={ 95 }
                                       text="Отмена" type={ 'normal' }
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
