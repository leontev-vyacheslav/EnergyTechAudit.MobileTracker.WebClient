import React, {useMemo} from "react";
import Form from 'devextreme-react/form'
import Button from 'devextreme-react/button'

import "./settings.scss";

export default () => {

    const formOptions = useMemo(() => {
        return {
            colCount: 1,
            formData: null,
            items: [
                {
                    itemType: 'tabbed',
                    tabs: [
                        {
                            title: 'Основные',
                            name: 'Map',
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
                            ]
                        }
                    ]
                }
            ]
        }
    }, []);

    return (
        <React.Fragment>
            <h2 className={"content-block"}>Настройки</h2>
            <div className={"content-block"}>
                <div className={"dx-card responsive-paddings"}>
                    <Form colCount={formOptions.colCount} items={formOptions.items}>

                    </Form>
                    <Button className={'form-success-button'} text={'OK'} width={125} type={'success'}/>
                </div>
            </div>
        </React.Fragment>
    )
};
