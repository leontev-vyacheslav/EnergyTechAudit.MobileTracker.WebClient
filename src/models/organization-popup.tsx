import { OfficeOrganizationPopupModel } from './office-organization-popup';
import { Entity } from './entity';
import { ScheduleItemModel } from './schedule-item';

export interface OrganizationOfficesModel extends Entity {
  description: string | null,
  organizationId: number,
  office: OfficeOrganizationPopupModel | null,
  scheduleItems: ScheduleItemModel[] | null,
  schedules: any | null,
  shortName: string | null,
}

