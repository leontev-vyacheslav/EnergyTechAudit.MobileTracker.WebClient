import { Workbook } from 'exceljs';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { excelCommonCellStyler, excelHeaderCellStyler, excelSaver } from '../../../utils/excel-export-helper';

const stationaryZonesExcelExporter = ({ dxDataGrid, mobileDevice, workDate, title }) => {
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
                    case 'speed': {
                        excelCell.value = gridCell.value * 3.6;
                        excelCell.numFmt = '#.##';
                        break;
                    }
                    case 'count': {
                        excelCell.value = gridCell.value;
                        break;
                    }
                    default: {
                        excelCell.value = gridCell.value;
                        excelCell.numFmt = '#.##';
                        break;
                    }
                }
            } else if (gridCell.rowType === 'header') {
                excelHeaderCellStyler({ excelCell });
            }
        }
    }).then(() => {
        excelSaver({ workbook, mobileDevice, workDate, title });
    });
};

export { stationaryZonesExcelExporter };