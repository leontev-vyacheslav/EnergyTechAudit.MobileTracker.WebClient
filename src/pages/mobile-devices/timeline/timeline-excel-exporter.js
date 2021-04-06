import { Workbook } from 'exceljs';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { excelCommonCellStyler, excelHeaderCellStyler, excelSaver } from '../../../utils/excel-export-helper';

const timelineExcelExporter = ({ dxDataGrid, mobileDevice, workDate, title }) => {
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
                    case 'beginDate': {
                        excelCell.value = `${ new Date(gridCell.data.beginDate).toLocaleDateString('ru-RU', {
                            hour: 'numeric', minute: 'numeric'
                        }) } - ${ new Date(gridCell.data.endDate).toLocaleTimeString('ru-RU', {
                            hour: 'numeric', minute: 'numeric'
                        }) }`;
                        break;
                    }
                    default: {
                        excelCell.value = gridCell.value;
                        excelCell.numFmt = '#.##';
                        break;
                    }
                }
            } else if(gridCell.rowType === 'header') {
                excelHeaderCellStyler({ excelCell });
            }
        }
    }).then(() => {
        excelSaver({ workbook, mobileDevice, workDate, title });
    })
};

export { timelineExcelExporter };
