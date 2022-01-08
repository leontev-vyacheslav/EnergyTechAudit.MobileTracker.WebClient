import React, { useEffect, useRef, useState } from 'react';
import Form, { SimpleItem } from 'devextreme-react/form';
import Button from 'devextreme-react/button';
import { DialogConstants } from '../../../constants/app-dialog-constant';
import { AppDataContextModel, useAppData } from '../../../contexts/app-data';
import ScrollView from 'devextreme-react/scroll-view';
import AppModalPopup from '../app-modal-popup/app-modal-popup';
import { ExtendedUserInfoPopupProps } from '../../../models/extended-user-info-popup-props';

const ExtendedUserInfoPopup = ({ userId, callback }: ExtendedUserInfoPopupProps) => {
    const formRef = useRef<Form>(null);
    const { getExtendedUserInfoAsync, postExtendedUserInfoAsync, getOrganizationsAsync, getOrganizationOfficesAsync }: AppDataContextModel = useAppData();

    const [extendedUserInfo, setExtendedUserInfo] = useState(null);
    const [offices, setOffices] = useState<[] | null>(null);
    const [organizations, setOrganizations] = useState(null);
    const [currentOrganization, setCurrentOrganization] = useState(null);

    useEffect(() => {
        ( async () => {
            let extendedUserInfo = await getExtendedUserInfoAsync(userId);
            extendedUserInfo = extendedUserInfo !== null ? { ...extendedUserInfo, ...{ organizationId: extendedUserInfo.office?.organizationId } } : null;
            setExtendedUserInfo(extendedUserInfo);

            const organizationId = extendedUserInfo !== null ? extendedUserInfo.office?.organizationId : null;
            const organizations = await getOrganizationsAsync();
            setOrganizations(organizations);

            const organizationOffices = await getOrganizationOfficesAsync(organizationId);
            const offices = organizationOffices.map((org: any) => org.office);

            if (extendedUserInfo && extendedUserInfo.officeId) {
                setOffices(offices);
            }
        } )();
    }, [getExtendedUserInfoAsync, getOrganizationOfficesAsync, getOrganizationsAsync, userId]);

    useEffect(() => {
        ( async () => {
            if (currentOrganization) {
                const organizationOffices = await getOrganizationOfficesAsync(currentOrganization);
                const offices = organizationOffices.map((org: any) => org.office);

                setOffices(offices);
            } else {
                setOffices([]);
                setExtendedUserInfo((previous: any) => {
                    return { ...previous, ...{ officeId: null } }
                });
            }
        } )();
    }, [currentOrganization, getOrganizationOfficesAsync]);

    return organizations ? (
        <AppModalPopup title={ 'Сведения о пользователе' } callback={ callback }>
            <div className={ 'popup-form-container' }>
                <ScrollView>
                    <Form className={ 'responsive-paddings' } ref={ formRef } formData={ extendedUserInfo }>
                        <SimpleItem dataField={ 'organizationId' }
                                    label={ { location: 'top', showColon: true, text: 'Организация' } }
                                    editorType={ 'dxSelectBox' }
                                    editorOptions=
                                        { {
                                            dataSource: organizations,
                                            showClearButton: true,
                                            valueExpr: 'id',
                                            displayExpr: 'shortName',
                                            onValueChanged: (e: any) => {
                                                setCurrentOrganization(e.value);
                                            }
                                        } }
                        />
                        <SimpleItem dataField={ 'officeId' }
                                    label={ { location: 'top', showColon: true, text: 'Офис' } }
                                    editorType={ 'dxSelectBox' }
                                    editorOptions=
                                        { {
                                            dataSource: offices,
                                            valueExpr: 'id',
                                            displayExpr: 'address',
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
                </ScrollView>
                <div className={ 'popup-form-buttons-row' }>
                    <div>&nbsp;</div>
                    <Button type={ 'default' } text={ DialogConstants.ButtonCaptions.Ok } width={ DialogConstants.ButtonWidths.Normal }
                            onClick={ async () => {
                                let formData = formRef.current?.instance.option('formData');
                                formData = { ...formData, ...{ id: userId } };
                                const validationGroupResult = formRef.current?.instance.validate();
                                if (validationGroupResult && !validationGroupResult.isValid) {
                                  if (validationGroupResult.brokenRules?.find(() => true))
                                    validationGroupResult.validators?.find(() => true).focus()
                                } else {
                                    const responseData = await postExtendedUserInfoAsync(formData);
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
        </AppModalPopup>
    ) : null;
};

export default ExtendedUserInfoPopup;
