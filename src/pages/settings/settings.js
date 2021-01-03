import React, { useMemo, useRef } from 'react';
import Form from 'devextreme-react/form'
import Button from 'devextreme-react/button'
import { useAppSettings } from '../../contexts/app-settings';
import notify from 'devextreme/ui/notify';
import { useScreenSize } from '../../utils/media-query';

import './settings.scss';
import { SettingsIcon } from '../../utils/app-icons';

export default () => {
    let dxAppSettingsFormRef = useRef(null);
    const { appSettingsData, setAppSettingsData } = useAppSettings();
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
                        },
                        {
                            title: 'Карта',
                            name: 'Map',
                            items: [
                                {
                                    label: {
                                        text: 'Показывать интервалы разрыва на карте',
                                        location: 'top',
                                        showColon: true
                                    },
                                    dataField: 'isShownBreakInterval',
                                    editorType: 'dxCheckBox',
                                },
                                {
                                    label: {
                                        text: 'Интервал разрыва, (м)',
                                        location: 'top',
                                        showColon: true
                                    },
                                    dataField: 'breakInterval',
                                    editorType: 'dxNumberBox',
                                    editorOptions: {
                                        type: 'integer',
                                        min: 100,
                                        max: 10000,
                                        width: 400
                                    }
                                },
                                {
                                    label: {
                                        text: 'Минимальная точность, (м)',
                                        location: 'top',
                                        showColon: true
                                    },
                                    dataField: 'minimalAccuracy',
                                    editorType: 'dxNumberBox',
                                    editorOptions: {
                                        type: 'integer',
                                        min: 10,
                                        max: 1000,
                                        width: 400
                                    }
                                },{
                                    label: {
                                        text: 'Радиус стационарности, (м)',
                                        location: 'top',
                                        showColon: true
                                    },
                                    dataField: 'stationaryRadius',
                                    editorType: 'dxNumberBox',
                                    editorOptions: {
                                        type: 'integer',
                                        min: 50,
                                        max: 500,
                                        width: 400
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }, [appSettingsData]);
    const { isXSmall } = useScreenSize();

    return (
        <>
            <div style={ { display: 'grid', gridTemplateColumns: '30px 1fr', marginLeft: 20, alignItems: 'center' } }>
                <SettingsIcon size={ 30 } color={ 'rgba(0, 0, 0, 0.87)' } />
                <h2 className={ 'content-block' }>Настройки</h2>
            </div>
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
        </>
    );
};
