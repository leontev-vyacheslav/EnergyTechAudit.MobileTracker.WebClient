import React, { useMemo, useRef } from 'react';
import Form, { SimpleItem, Tab, TabbedItem } from 'devextreme-react/form'
import Button from 'devextreme-react/button'
import { useAppSettings } from '../../contexts/app-settings';
import notify from 'devextreme/ui/notify';
import { useScreenSize } from '../../utils/media-query';
import { SettingsIcon } from '../../constants/app-icons';
import PageHeader from '../../components/page-header/page-header';

import './settings.scss';
export default () => {
    let dxAppSettingsFormRef = useRef(null);
    const { appSettingsData, setAppSettingsData } = useAppSettings();

    const { isXSmall } = useScreenSize();

   const formData = useMemo(() => {
        return { ...appSettingsData };
    }, [appSettingsData]);

    return (
        <>
            <PageHeader caption={ 'Настройки' }>
                <SettingsIcon size={ 30 }/>
            </PageHeader>
            { formData ?
                ( <div className={ 'content-block' }>
                        <div className={ 'dx-card responsive-paddings' }>

                            <Form
                                height={ 450 }
                                colCount={ 1 }
                                formData={ formData }
                                ref={ dxAppSettingsFormRef }
                            >
                                <TabbedItem>
                                    {/*  */}
                                    <Tab title={ 'Основные' }>
                                        <SimpleItem
                                            dataField={ 'workDate' }
                                            label={ { location: 'top', showColon: true, text: 'Рабочая дата' } }
                                            editorType={ 'dxDateBox' }
                                            editorOptions={ {
                                                type: 'date',
                                                width: 400
                                            } }
                                        />
                                        <SimpleItem
                                            dataField={ 'duringWorkingDay' }
                                            label={ { location: 'top', showColon: true, text: 'В течении рабочего дня' } }
                                            editorType={ 'dxCheckBox' }
                                        />
                                    </Tab>
                                    {/* */}
                                    <Tab title={ 'Карты' }>
                                        <SimpleItem
                                            dataField={ 'isShownBreakInterval' }
                                            label={ { location: 'top', showColon: true, text: 'Показывать интервалы разрыва на карте' } }
                                            editorType={ 'dxCheckBox' }
                                        />
                                        <SimpleItem
                                            dataField={ 'breakInterval' }
                                            label={ { location: 'top', showColon: true, text: 'Интервал разрыва, (м)' } }
                                            editorType={ 'dxNumberBox' }
                                            editorOptions={ {
                                                type: 'integer',
                                                min: 100,
                                                max: 10000,
                                                width: 400
                                            } }
                                        />
                                        <SimpleItem
                                            dataField={ 'minimalAccuracy' }
                                            label={ { location: 'top', showColon: true, text: 'Минимальная точность, (м)' } }
                                            editorType={ 'dxNumberBox' }
                                            editorOptions={ {
                                                type: 'integer',
                                                min: 10,
                                                max: 1000,
                                                width: 400
                                            } }
                                        />
                                        <SimpleItem
                                            dataField={ 'stationaryRadius' }
                                            label={ { location: 'top', showColon: true, text: 'Радиус стационарности, (м)' } }
                                            editorType={ 'dxNumberBox' }
                                            editorOptions={ {
                                                type: 'integer',
                                                min: 50,
                                                max: 500,
                                                width: 400
                                            } }
                                        />
                                    </Tab>
                                </TabbedItem>
                            </Form>

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
                                                }, 'success', 5000
                                            );
                                        }
                                    } }/>
                        </div>
                    </div>
                )
                : null }
        </>
    );
};
