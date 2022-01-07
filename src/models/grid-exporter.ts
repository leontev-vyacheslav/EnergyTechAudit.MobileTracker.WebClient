import dxDataGrid from 'devextreme/ui/data_grid';
import { MobileDeviceModel } from '../pages/mobile-devices/mobile-devices';

export type GridExporterModel = {
  dataGrid: dxDataGrid<any, any>,
  title: string
}

export type GridExporterExtendedModel = GridExporterModel & { mobileDevice: MobileDeviceModel, workDate: Date }
