import { Workbook, Cell } from 'exceljs';
import { DataGridCell, exportDataGrid } from 'devextreme/excel_exporter';
import { excelCommonCellStyler, excelGroupCellStyler, excelHeaderCellStyler, excelSaver } from '../../utils/excel-export-helper';
import { GridExporterModel } from '../../models/grid-exporter';

const organizationsExcelExporter = ({ dataGrid, title }: GridExporterModel) => {
    const workbook = new Workbook(),
        worksheet = workbook.addWorksheet(title, {
            properties: {
                defaultRowHeight: 25
            }
        });

    exportDataGrid({
        component: dataGrid,
        worksheet: worksheet,
        customizeCell: ({ gridCell, excelCell }: { gridCell?: DataGridCell; excelCell?: Cell }) => {
            if(gridCell && excelCell) {
                excelCommonCellStyler(excelCell);
                if (gridCell.rowType === 'data') {
                    switch (gridCell.column?.dataField) {
                        default: {
                            excelCell.value = gridCell.value;
                            excelCell.numFmt = '#.##';
                            break;
                        }
                    }
                } else if (gridCell.rowType === 'group') {
                    const groupElement = dataGrid.getDataSource().items().find(i => i.key === gridCell.value);
                    excelCell.value = groupElement?.items.find(() => 0 === 0)?.description;
                    excelGroupCellStyler(excelCell);
                } else if (gridCell.rowType === 'header') {
                    excelHeaderCellStyler(excelCell);
                }
            }
        }
    }).then(() => {
        excelSaver({ workbook, title });
    })
};

export { organizationsExcelExporter };
