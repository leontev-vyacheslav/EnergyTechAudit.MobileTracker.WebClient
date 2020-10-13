import React, { useMemo, useRef } from 'react';
import Form from 'devextreme-react/form'
import Button from 'devextreme-react/button'
import { useAppSettings } from '../../contexts/app-settings';

import './settings.scss';
import notify from 'devextreme/ui/notify';
import { useScreenSize } from '../../utils/media-query';

export default () => {
    let dxAppSettingsFormRef = useRef(null);
    const { appSettingsData, setAppSettingsData } = useAppSettings();
    console.log(appSettingsData);

    const formOptions = useMemo(() => {
        return {
            colCount: 1,
            formData: appSettingsData,
            items: [
                {
                    itemType: 'tabbed',
                    tabs: [
                        {
                            title: 'Основные',
                            name: 'Main',
                            items: [
                                {
                                    label: {
                                        text: 'Рабочая дата',
                                        location: 'top',
                                        showColon: true
                                    },
                                    dataField: 'workDate',
                                    editorType: 'dxDateBox',
                                    editorOptions: {
                                        type: 'date',
                                        width: 400
                                    }
                                },
                                {
                                    label: {
                                        text: 'В течении рабочего дня',
                                        location: 'top',
                                        showColon: true
                                    },
                                    dataField: 'duringWorkingDay',
                                    editorType: 'dxCheckBox',
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }, [appSettingsData]);
    const { isXSmall, isLarge } = useScreenSize();

    return (
        <React.Fragment>
            <h2 className={ 'content-block' }>Настройки</h2>
            <div className={ 'content-block' }>
                <div className={ 'dx-card responsive-paddings' }>
                    <Form
                        colCount={ formOptions.colCount }
                        items={ formOptions.items }
                        formData={ formOptions.formData }
                        ref={ dxAppSettingsFormRef }
                    />

                    <Button className={ 'form-success-button' } text={ 'OK' } width={ 125 } type={ 'success' }
                            onClick={ () => {
                                const formRef = dxAppSettingsFormRef.current;
                                if (formRef && formRef.instance) {
                                    setAppSettingsData({ ...appSettingsData, ...formRef.instance.option('formData') });
                                    notify({
                                            message: 'Настройки приложения успешно сохранены.',
                                            width: 300,
                                            height: 60,
                                            position: isXSmall ? 'bottom center' : {
                                                at: 'bottom right',
                                                my: 'bottom right',
                                                offset: '-20 -20'
                                            }
                                        }
                                        , 'success', 5000
                                    );
                                }
                            } }/>
                </div>
            </div>
        </React.Fragment>
    )
};
