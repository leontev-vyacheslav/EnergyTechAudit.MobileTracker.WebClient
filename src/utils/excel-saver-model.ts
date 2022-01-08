import { Workbook } from 'exceljs';
import { MobileDeviceModel } from '../models/mobile-device';

export type ExcelSaverModel = {
  workbook: Workbook,
  mobileDevice?: MobileDeviceModel,
  workDate?: Date,
  title: string
}
