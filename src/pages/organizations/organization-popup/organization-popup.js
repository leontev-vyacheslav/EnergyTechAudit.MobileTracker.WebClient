import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DialogConstants } from '../../../constants/app-dialog-constant';
import ScrollView from 'devextreme-react/scroll-view';
import Form, { GroupItem, SimpleItem, Tab, TabbedItem } from 'devextreme-react/form';
import Button from 'devextreme-react/button';
import { useAppData } from '../../../contexts/app-data';
import AppModalPopup from '../../../components/app-modal-popup/app-modal-popup';

import './organization-popup.scss'
import { AddIcon, DeleteIcon } from '../../../constants/app-icons';

const OrganizationPopup = ({ editMode, organization, callback }) => {
    const { getOrganizationOfficesAsync, postOrganizationAsync, deleteScheduleItemAsync } = useAppData();
    const [currentOrganization, setCurrentOrganization] = useState(null);

    const formRef = useRef(null);

    useEffect(() => {
        ( async () => {
            if (editMode === true && organization) {
                const organizationOffices = await getOrganizationOfficesAsync(organization.organizationId);
                const organizationOffice = organizationOffices.find(org => !!org);

                const scheduleItems = {};
                organizationOffice.scheduleItems.forEach((si, i) => {
                    scheduleItems[`scheduleItems${i}`] = si;
                } );
                const currentOrganization = {
                    id: organizationOffice.organizationId,
                    description: organizationOffice.description,
                    shortName: organizationOffice.shortName,
                    scheduleItems: scheduleItems
                };
                setCurrentOrganization(currentOrganization);
                console.log(currentOrganization);
            } else {
                setCurrentOrganization({
                    shortName: null,
                    description: null,
                    scheduleItems: { }
                })
            }
        } )()
    }, [editMode, getOrganizationOfficesAsync, organization])

    const addSchedule = useCallback(() => {
        const count = Object.keys(currentOrganization.scheduleItems).length;
        const periodBegin = new Date(), periodEnd = new Date();
        periodBegin.setHours(8, 30, 0);
        periodEnd.setHours(17, 30, 0);

        const scheduleItem = {
            scheduleTypeId: 2,
            enabled: true,
            periodBegin: periodBegin.toLocaleTimeString('ru-RU',),
            periodEnd: periodEnd.toLocaleTimeString('ru-RU'),
        };
        const scheduleItems = currentOrganization.scheduleItems;

        scheduleItems[`scheduleItem${ count }`] = scheduleItem;

        setCurrentOrganization({ ...currentOrganization, ...{ scheduleItems: scheduleItems } });
        console.log(currentOrganization);
    }, [currentOrganization]);

    const removeSchedule = useCallback(async (index) => {
            const scheduleItems = currentOrganization.scheduleItems;
            const scheduleItem = scheduleItems[`scheduleItems${ index }`];
            if (scheduleItem) {
                delete scheduleItems[`scheduleItems${ index }`];

                Object.keys(scheduleItems).forEach( (fieldName, i) => {

                    if (fieldName !== `scheduleItems${ i }`) {
                        Object.defineProperty(scheduleItems, `scheduleItems${ i }`,
                            Object.getOwnPropertyDescriptor(scheduleItems, fieldName));

                        delete scheduleItems[fieldName];
                    }
                })
                if (scheduleItem.id) {
                    await deleteScheduleItemAsync(scheduleItem.id);
                }
            }
            setCurrentOrganization({ ...currentOrganization, ...{ scheduleItems: scheduleItems } });
        }, [currentOrganization, deleteScheduleItemAsync]
    );

    const scheduleTypes = useMemo(() => {
        return [
            { id: 2, code: 'ByWorkingDaysOfWeek', description: 'По рабочим дням недели' },  // 2, 3, 4, 5, 6
            { id: 3, code: 'ByHolidaysOfWeek', description: 'По выходным дням недели' },    // 7, 1
        ]
    }, []);

    return currentOrganization ? (
        <AppModalPopup title={ 'Организация' } onClose={ callback }>
            <div className={ 'popup-form-container' }>
                <ScrollView>
                    <div className={ 'dx-card responsive-paddings' }>
                        <Form className={ 'organization-popup-form' } ref={ formRef } formData={ currentOrganization }>
                            <TabbedItem>
                                <Tab title={ 'Основные' }>
                                    <SimpleItem dataField={ 'description' }
                                                isRequired={ true }
                                                label={ { location: 'top', showColon: true, text: 'Полное наименование ' } }
                                                editorType={ 'dxTextBox' }
                                                editorOptions={ {
                                                    showClearButton: true
                                                } }
                                    />

                                    <SimpleItem dataField={ 'shortName' }
                                                isRequired={ true }
                                                label={ { location: 'top', showColon: true, text: 'Сокращенное наименование ' } }
                                                editorType={ 'dxTextBox' }
                                                editorOptions={ {
                                                    showClearButton: true
                                                } }
                                    />
                                </Tab>
                                <Tab title={ 'Расписание' }>
                                    { Object.keys(currentOrganization.scheduleItems).map ((fieldName, i) => {
                                       return (
                                           <GroupItem key={ i } caption={ `Элемент расписания № ${i + 1}` }>
                                                <SimpleItem
                                                    dataField={ `scheduleItems.${ fieldName }.scheduleTypeId` }
                                                    label={ { location: 'top', showColon: true, text: 'Тип' } }
                                                    editorType={ 'dxSelectBox' }
                                                    editorOptions=
                                                        { {
                                                            dataSource: scheduleTypes,
                                                            valueExpr: 'id',
                                                            displayExpr: 'description',
                                                        } }
                                                />
                                               <SimpleItem
                                                   dataField={ `scheduleItems.${ fieldName }.periodBegin` }
                                                   label={ { location: 'top', showColon: true, text: 'Начало периода' } }
                                                   editorType={ 'dxDateBox' } editorOptions=
                                                       { {
                                                           type: 'time',
                                                           pickerType: 'rollers',
                                                       } }
                                               />
                                               <SimpleItem
                                                   dataField={ `scheduleItems.${ fieldName }.periodEnd` }
                                                   label={ { location: 'top', showColon: true, text: 'Конец периода' } }
                                                   editorType={ 'dxDateBox' } editorOptions=
                                                       { {
                                                           type: 'time',
                                                           pickerType: 'rollers',
                                                       } }
                                               />

                                               <SimpleItem render={ () => {
                                                   return (
                                                       <div style={ { width: '100%', textAlign: 'right' } }>
                                                           <Button text={ 'Удалить' }
                                                                   onClick={ removeSchedule.bind(this, i) }>
                                                               <DeleteIcon className={ 'dx-icon' } size={ 18 } />
                                                               <span className="dx-button-text">Удалить</span>
                                                           </Button>
                                                       </div>
                                                   );
                                               } } />
                                        </GroupItem>
                                       );
                                    })}
                                    <SimpleItem render={ () => {
                                        return (
                                            <div style={ { width: '100%', textAlign: 'left' } }>
                                                <Button text={ 'Добавить' } onClick={ addSchedule }>
                                                    <AddIcon className={ 'dx-icon' } size={ 18 } />
                                                    <span className="dx-button-text">Добавить</span>
                                                </Button>
                                            </div>
                                        );
                                    } } />

                                </Tab>
                            </TabbedItem>
                        </Form>
                    </div>
                </ScrollView>
                <div className={ 'popup-form-buttons-row' }>
                    <div>&nbsp;</div>
                    <Button type={ 'default' } text={ DialogConstants.ButtonCaptions.Ok } width={ DialogConstants.ButtonWidths.Normal }
                            onClick={ async () => {
                                let formData = formRef.current.instance.option('formData');

                                formData.scheduleItems = Object.keys(formData.scheduleItems).map(s => {
                                    return formData.scheduleItems[s];
                                });
                                const responseData = await postOrganizationAsync(formData);
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
    ) : null;
}

export default OrganizationPopup;
