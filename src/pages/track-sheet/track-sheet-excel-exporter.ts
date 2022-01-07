import { Workbook } from 'exceljs';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { excelCommonCellStyler, excelGroupCellStyler, excelHeaderCellStyler, excelSaver } from '../../utils/excel-export-helper';
import { getUserDeviceDescription } from '../../utils/string-helper';
import { GridExporterExtendedModel } from '../../models/grid-exporter';

const trackSheetExcelExporter = ({ dataGrid, mobileDevice, workDate, title }: GridExporterExtendedModel) => {
    const workbook = new Workbook(),
        worksheet = workbook.addWorksheet(title, {
            properties: {
                defaultRowHeight: 25
            }
        });

    exportDataGrid({
        component: dataGrid,
        worksheet: worksheet,
        customizeCell: ({ gridCell, excelCell }) => {
            excelCommonCellStyler({ excelCell });
            if (gridCell) {
                if (gridCell.rowType === 'data') {
                    switch (gridCell.column?.dataField) {
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
                    const groupElement = dataGrid.getDataSource().items().find(i => i.key === gridCell.value);
                    if (groupElement) {
                        excelCell.value = getUserDeviceDescription(mobileDevice);
                    }
                    excelGroupCellStyler({ excelCell });
                } else if (gridCell.rowType === 'header') {
                    excelHeaderCellStyler({ excelCell });
                }
            }
        }
    }).then(() => {
        excelSaver({ workbook, mobileDevice, workDate, title })
    });
};

export { trackSheetExcelExporter };
