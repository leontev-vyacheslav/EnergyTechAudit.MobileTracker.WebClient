import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DialogConstants } from '../../../constants/app-dialog-constant';
import ScrollView from 'devextreme-react/scroll-view';
import Form, { GroupItem, SimpleItem, Tab, TabbedItem } from 'devextreme-react/form';
import Button from 'devextreme-react/button';
import { AppDataContextModel, useAppData } from '../../../contexts/app-data';
import AppModalPopup from '../app-modal-popup/app-modal-popup';
import { ToolbarItem } from 'devextreme-react/popup';
import Moment from 'moment';
import { AdditionalMenuIcon, OrganizationIcon, ScheduleIcon } from '../../../constants/app-icons';
import IconTab from '../../tab-utils/icon-tab';
import OrganizationPopupMenu from './organization-popup-menu/organization-popup-menu'
import { OrganizationPopupProps } from '../../../models/organization-popup-props';
import ContextMenu from 'devextreme-react/context-menu';
import './organization-popup.scss'

export type OrganizationPopupModel = {
    id: number,
    shortName: string | null,
    description: string | null,
    scheduleItems: object
}

const OrganizationPopup = ({ editMode, organization, callback }: OrganizationPopupProps) => {
    const { getOrganizationOfficesAsync, postOrganizationAsync, deleteScheduleItemAsync }: AppDataContextModel = useAppData();
    const [currentOrganization, setCurrentOrganization] = useState<OrganizationPopupModel | null>(null);
    const formRef = useRef<Form>(null);
    const contextMenuRef = useRef<ContextMenu<any>>(null);
    const currentSelectedIndex = useRef<number>(0);

    useEffect(() => {
        ( async () => {
            if (editMode && organization) {
                const organizationOffices = await getOrganizationOfficesAsync(organization.organizationId);
                const organizationOffice = organizationOffices.find((org: any) => !!org);

                const scheduleItems: any = {};
                organizationOffice.scheduleItems.forEach((si: any, i: number) => {
                    si.periodBegin = Moment(si.periodBegin, 'HH:mm:ss').toDate();
                    si.periodEnd = Moment(si.periodEnd, 'HH:mm:ss').toDate();
                    scheduleItems[`scheduleItem${ i }`] = si;
                });
                const currentOrganization = {
                    id: organizationOffice.organizationId,
                    description: organizationOffice.description,
                    shortName: organizationOffice.shortName,
                    scheduleItems: scheduleItems
                };
                setCurrentOrganization(currentOrganization);
            } else {
                setCurrentOrganization({
                    id: 0,
                    shortName: null,
                    description: null,
                    scheduleItems: {}
                })
            }
        } )()
    }, [editMode, getOrganizationOfficesAsync, organization])

    const addSchedule = useCallback(() => {
        if (!currentOrganization) {
            return;
        }

        const count = Object.keys(currentOrganization.scheduleItems).length;
        const periodBegin = new Date(), periodEnd = new Date();
        periodBegin.setHours(8, 30, 0);
        periodEnd.setHours(17, 30, 0);

        const scheduleItem = {
            scheduleTypeId: 2,
            periodBegin: periodBegin,
            periodEnd: periodEnd,
        };

        const scheduleItems: any = currentOrganization.scheduleItems;
        scheduleItems[`scheduleItem${ count }`] = scheduleItem;
        setCurrentOrganization({ ...currentOrganization, ...{ scheduleItems: scheduleItems } });
    }, [currentOrganization]);

    const removeSchedule = useCallback(async (index) => {
        if (!currentOrganization) {
            return;
        }

        const scheduleItems: any = currentOrganization.scheduleItems;
        const scheduleItem = scheduleItems[`scheduleItem${ index }`];
        if (scheduleItem) {
            delete scheduleItems[`scheduleItem${ index }`];

            Object.keys(scheduleItems).forEach((fieldName, i) => {

                if (fieldName !== `scheduleItem${ i }`) {
                    const propertyDescriptor = Object.getOwnPropertyDescriptor(scheduleItems, fieldName);
                    if(propertyDescriptor) {
                        Object.defineProperty(scheduleItems, `scheduleItem${i}`, propertyDescriptor);
                    }
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
        <AppModalPopup title={ 'Организация' } callback={ callback }>
            <div className={ 'popup-form-container' }>
                <ScrollView>
                    <Form className={ 'organization-popup-form responsive-paddings' } ref={ formRef } formData={ currentOrganization }>
                        <TabbedItem tabPanelOptions={ {
                            selectedIndex: currentSelectedIndex.current,
                            onSelectionChanged: (e: any) => {
                                currentSelectedIndex.current = e.component.option('selectedIndex');
                            }
                        } }>
                            <Tab title={ 'Основные' } tabRender={ (tab) => <IconTab tab={ tab }><OrganizationIcon size={ 18 }/></IconTab> }>
                                <SimpleItem
                                    dataField={ 'description' }
                                    isRequired={ true }
                                    label={ { location: 'top', showColon: true, text: 'Полное наименование ' } }
                                    editorType={ 'dxTextBox' }
                                    editorOptions={ {
                                        showClearButton: true
                                    } }
                                />
                                <SimpleItem
                                    dataField={ 'shortName' }
                                    isRequired={ true }
                                    label={ { location: 'top', showColon: true, text: 'Сокращенное наименование ' } }
                                    editorType={ 'dxTextBox' }
                                    editorOptions={ {
                                        showClearButton: true
                                    } }
                                />
                            </Tab>
                            <Tab title={ 'Расписание' } tabRender={ (tab) => <IconTab tab={ tab }><ScheduleIcon size={ 18 }/></IconTab> }>
                                { Object.keys(currentOrganization.scheduleItems).map((fieldName, i) => {
                                    return (
                                        <GroupItem key={ i } caption={ `Элемент расписания № ${ i + 1 }` } >
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
                                                        <Button  text={ 'Удалить' }
                                                                onClick={ removeSchedule.bind(this, i) }>
                                                            <ScheduleIcon className={ 'dx-icon' } size={ 18 }/>
                                                            <span className="dx-button-text">Удалить</span>
                                                        </Button>
                                                    </div>
                                                );
                                            } }/>
                                        </GroupItem>
                                    );
                                }) }
                            </Tab>
                        </TabbedItem>
                    </Form>
                </ScrollView>
                <div className={ 'popup-form-buttons-row' }>
                    <div>&nbsp;</div>
                    <Button type={ 'default' } text={ DialogConstants.ButtonCaptions.Ok } width={ DialogConstants.ButtonWidths.Normal }
                            onClick={ async () => {
                                const formData = formRef.current?.instance.option('formData');
                                const validationGroupResult = formRef.current?.instance.validate();
                                if (validationGroupResult && !validationGroupResult.isValid) {
                                    if(validationGroupResult.brokenRules?.find(() => true)) {
                                        validationGroupResult.validators?.find(() => true).focus()
                                    }
                                } else {
                                    formData.scheduleItems = Object.keys(formData.scheduleItems).map(s => {
                                        const scheduleItem = formData.scheduleItems[s];
                                        return {
                                            ...scheduleItem, ...{
                                                periodBegin: scheduleItem.periodBegin instanceof Date
                                                    ? scheduleItem.periodBegin.toLocaleTimeString('ru-RU')
                                                    : scheduleItem.periodBegin,
                                                periodEnd: scheduleItem.periodEnd instanceof Date
                                                    ? scheduleItem.periodEnd.toLocaleTimeString('ru-RU')
                                                    : scheduleItem.periodEnd
                                            }
                                        };
                                    });
                                    const responseData = await postOrganizationAsync(formData);
                                    callback({ modalResult: DialogConstants.ModalResults.Ok, data: responseData !== null ? formData : null });
                                }
                            } }
                    />
                    <Button type={ 'normal' } text={ DialogConstants.ButtonCaptions.Cancel } width={ DialogConstants.ButtonWidths.Normal }
                            onClick={ () => {
                                callback({ modalResult: DialogConstants.ModalResults.Cancel, data: null });
                            } }
                    />
                </div>
            </div>
            <ToolbarItem location={ 'after' }>
                <Button className={ 'app-popup-header-menu-button' } onClick={ async e => {
                    if (contextMenuRef && contextMenuRef.current) {
                        contextMenuRef.current.instance.option('target', e.element);
                        await contextMenuRef.current.instance.show();
                    }
                } }>
                    <AdditionalMenuIcon size={ 18 }/>
                    <OrganizationPopupMenu
                      ref={ contextMenuRef }
                      commands={ {
                          addSchedule: addSchedule
                      } }
                    />
                </Button>
            </ToolbarItem>
        </AppModalPopup>
    ) : null;
}

export default OrganizationPopup;
