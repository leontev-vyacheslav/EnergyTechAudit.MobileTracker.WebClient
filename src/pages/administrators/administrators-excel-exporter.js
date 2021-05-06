import { Workbook } from 'exceljs';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { excelCommonCellStyler, excelGroupCellStyler, excelHeaderCellStyler, excelSaver } from '../../utils/excel-export-helper';

const administratorExcelExporter = ({ dxDataGrid, title }) => {
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
                    case 'email': {
                        excelCell.value = gridCell.value;
                        break;
                    }
                    default: {
                        excelCell.value = gridCell.value;
                        excelCell.numFmt = '#.##';
                        break;
                    }
                }
            } else if(gridCell.rowType === 'group') {
                const groupElement = dxDataGrid.getDataSource().items().find( i => i.key === gridCell.value);
                const organization = groupElement?.items.find(() => 0 === 0)?.organization;
                if(groupElement) {
                    excelCell.value = organization ? organization.shortName : 'Общая группа';
                }
                excelGroupCellStyler({ excelCell });

            } else if (gridCell.rowType === 'header') {
                excelHeaderCellStyler({ excelCell });
            }
        }
    }).then(() => {
        excelSaver({ workbook, title });
    });
};

export { administratorExcelExporter };
