import React from 'react';
import DateBox from 'devextreme-react/date-box';
import { useAppSettings } from '../../contexts/app-settings';
import { useSharedArea } from '../../contexts/shared-area';

const WorkDatePicker = () => {
    const { appSettingsData, setAppSettingsData } = useAppSettings();
    const { workDatePickerRef } = useSharedArea();
    return (
        <DateBox ref={ workDatePickerRef }
                 style={ { width: 0 } }
                 visible={ true }
                 value={ appSettingsData.workDate }
                 pickerType={ 'rollers' }
                 onValueChanged={ e => {
                     setAppSettingsData({ ...appSettingsData, ...{ workDate: e.value } });
                 } }/>
    );
};

export default WorkDatePicker;
