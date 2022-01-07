import { Workbook } from 'exceljs';
import { DataGridCell, exportDataGrid } from 'devextreme/excel_exporter';
import { excelCommonCellStyler, excelHeaderCellStyler, excelSaver } from '../../../utils/excel-export-helper';
import { GridExporterExtendedModel } from '../../../models/grid-exporter';

const stationaryZonesExcelExporter = ({ dataGrid, mobileDevice, workDate, title }: GridExporterExtendedModel) => {
    const workbook = new Workbook(),
        worksheet = workbook.addWorksheet(title, {
            properties: {
                defaultRowHeight: 25
            }
        });

    exportDataGrid({
        component: dataGrid,
        worksheet: worksheet,
        customizeCell: ({ gridCell, excelCell }: { gridCell?: DataGridCell; excelCell?: any }) => {
            excelCommonCellStyler({ excelCell });
            if (gridCell) {
                if (gridCell.rowType === 'data') {
                    switch (gridCell.column?.dataField) {
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
        }
    }).then(() => {
        excelSaver({ workbook, mobileDevice, workDate, title });
    });
};

export { stationaryZonesExcelExporter };
