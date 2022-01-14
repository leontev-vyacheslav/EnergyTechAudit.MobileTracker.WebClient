import dxDataGrid from 'devextreme/ui/data_grid';
import { MobileDeviceModel } from './mobile-device';
import { Entity } from './entity';

export type GridExporterModel = {
  dataGrid: dxDataGrid<Entity, number>,
  title: string
}

export type GridExporterExtendedModel = GridExporterModel & { mobileDevice: MobileDeviceModel, workDate: Date }
