import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DialogConstants } from '../../../constants/app-dialog-constant';
import ScrollView from 'devextreme-react/scroll-view';
import Form, { SimpleItem } from 'devextreme-react/form';
import Button from 'devextreme-react/button';
import { useAppData } from '../../../contexts/app-data';
import AppConstants from '../../../constants/app-constants';
import AppModalPopup from '../app-modal-popup/app-modal-popup';

const OfficePopup = ({ editMode, organization, callback }) => {

    const { getOfficeAsync, postOfficeAsync } = useAppData();

    const autocompleteRef = useRef(null);
    const formRef = useRef(null);

    const [currentOffice, setCurrentOffice] = useState(null);
    const [mapIsLoaded, setMapIsLoaded] = useState(false);

    useEffect(() => {
        ( async () => {
            if (organization) {
                if (editMode) {
                    let office = await getOfficeAsync(organization.office.id);
                    office = { ...office, ...{ organizationDescription: organization.description } };
                    setCurrentOffice(office);
                } else {
                    setCurrentOffice({
                        organizationId: organization.organizationId,
                        organizationDescription: organization.description,
                        address: null,
                        placeId: 0
                    })
                }
            }
        } )()
    }, [editMode, getOfficeAsync, organization]);

    useEffect(() => {
        if (!window.google || !window.google.maps || !window.google.maps.places) {
            const scriptElement = document.createElement('script');
            scriptElement.src = `${ AppConstants.trackMap.mapApiUrl }?key=${ AppConstants.trackMap.apiKey }&libraries=${ AppConstants.trackMap.libraries.join(',') }`;
            scriptElement.async = true;
            window.document.body.appendChild(scriptElement);
            scriptElement.addEventListener('load', () => {
                setMapIsLoaded(true);
            });
        } else {
            setMapIsLoaded(true);
        }
    }, []);

    const onPlaceChangedHandler = useCallback(() => {
        if (mapIsLoaded && formRef.current) {
            const editor = formRef.current.instance.getEditor('address');
            const input = editor.element().querySelector('input');

            const place = autocompleteRef.current.getPlace();
            if (place.geometry) {
                input.value = place.formatted_address;
                let formData = formRef.current.instance.option('formData');

                formData = {
                    ...formData,
                    ...{ address: place.formatted_address },
                    ...{
                        place: {
                            id: formData.place ? formData.place.id : 0,
                            latitude: place.geometry.location.lat(),
                            longitude: place.geometry.location.lng(),
                        }
                    }
                };
                setCurrentOffice(formData);
                autocompleteRef.current = null;
            }
        }
    }, [mapIsLoaded]);

    return (
        <AppModalPopup title={ 'Офис' } onClose={ callback }>
            <div className={ 'popup-form-container' }>
                <ScrollView>
                    <Form className={ 'organization-popup-form responsive-paddings' } ref={ formRef } formData={ currentOffice }>
                        <SimpleItem
                            dataField={ 'organizationDescription' }
                            label={ { location: 'top', showColon: true, text: 'Наименование организации' } }
                            editorType={ 'dxTextBox' }
                            editorOptions={
                                {
                                    readOnly: true
                                }
                            }
                        />
                        <SimpleItem
                            dataField={ 'address' }
                            isRequired={ true }
                            label={ { location: 'top', showColon: true, text: 'Адрес' } }
                            editorType={ 'dxTextBox' }
                            editorOptions={ {
                                showClearButton: true,
                                onFocusIn: (e) => {
                                    if (mapIsLoaded && !autocompleteRef.current) {
                                        const input = e.element.querySelector('input');
                                        autocompleteRef.current = new window.google.maps.places.Autocomplete(input, {
                                            types: ['geocode']
                                        });
                                        autocompleteRef.current.addListener('place_changed', onPlaceChangedHandler);
                                    }
                                }
                            } }
                        />
                    </Form>
                </ScrollView>
                <div className={ 'popup-form-buttons-row' }>
                    <div>&nbsp;</div>
                    <Button type={ 'default' } text={ DialogConstants.ButtonCaptions.Ok } width={ DialogConstants.ButtonWidths.Normal }
                            onClick={ async () => {
                                let formData = formRef.current.instance.option('formData');
                                const responseData = await postOfficeAsync(formData);
                                callback({ modalResult: DialogConstants.ModalResults.Ok, data: responseData !== null ? formData : null });
                            } }
                    />
                    <Button type={ 'normal' } text={ DialogConstants.ButtonCaptions.Cancel } width={ DialogConstants.ButtonWidths.Normal }
                            onClick={ () => {
                                callback({ modalResult: DialogConstants.ModalResults.Cancel, data: null });
                            } }
                    />
                </div>
            </div>
        </AppModalPopup>
    );
}

export default OfficePopup;
