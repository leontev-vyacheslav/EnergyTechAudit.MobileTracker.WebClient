import { Workbook } from 'exceljs';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { excelCommonCellStyler, excelGroupCellStyler, excelHeaderCellStyler, excelSaver } from '../../utils/excel-export-helper';

const mobileDeviceExcelExporter = ({ dxDataGrid, title }) => {
    const workbook = new Workbook(),
        worksheet = workbook.addWorksheet(title, {
            properties: {
                defaultRowHeight: 25
            }
        });

    exportDataGrid({
        component: dxDataGrid,
        worksheet: worksheet,
        customizeCell: ({ gridCell, excelCell }) => {
            excelCommonCellStyler({ excelCell });

            if (gridCell.rowType === 'data') {
                switch (gridCell.column.dataField) {
                    case 'registrationDate': {
                        excelCell.value = gridCell.value;
                        excelCell.numFmt = '[$-419]DD MMMM YYYY;@';
                        break;
                    }
                    default: {
                        excelCell.value = gridCell.value;
                        excelCell.numFmt = '#.##';
                        break;
                    }
                }
            } else if (gridCell.rowType === 'group') {
                const groupElement = dxDataGrid.getDataSource().items().find( i => i.key === gridCell.value);
                if (groupElement) {
                    const groupItem = groupElement?.items.find( () => 0 === 0);
                    const extendedUserInfo = groupItem?.extendedUserInfo;
                    excelCell.value = extendedUserInfo ? `${ extendedUserInfo.firstName } ${ extendedUserInfo.lastName }` : groupItem.email;
                }
                excelGroupCellStyler({ excelCell });
            } else if (gridCell.rowType === 'header') {
                excelHeaderCellStyler({ excelCell });
            }
        }
    })
        .then(() => {
            excelSaver({ workbook, title });
        });
}

export { mobileDeviceExcelExporter };
