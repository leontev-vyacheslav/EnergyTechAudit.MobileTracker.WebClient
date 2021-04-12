import { Workbook } from 'exceljs';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { excelCommonCellStyler, excelGroupCellStyler, excelHeaderCellStyler, excelSaver } from '../../utils/excel-export-helper';
import { getUserDeviceDescription } from '../../utils/string-helper';

const trackSheetExcelExporter = ({ dxDataGrid, mobileDevice, workDate, title }) => {
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
                    case 'distance': {
                        excelCell.value = gridCell.value / 1000;
                        excelCell.numFmt = '#.##';
                        break;
                    }
                    case 'date': {
                        excelCell.value = new Date(gridCell.value)
                            .toLocaleDateString(
                                'ru-RU',
                                { day: '2-digit', month: 'long', year: 'numeric' }
                            );
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
                    excelCell.value = getUserDeviceDescription(mobileDevice);
                }
                excelGroupCellStyler({ excelCell });
            } else if (gridCell.rowType === 'header') {
                excelHeaderCellStyler({ excelCell });
            }
        }
    }).then(() => {
        excelSaver({ workbook, mobileDevice, workDate, title })
    });
};

export { trackSheetExcelExporter };
