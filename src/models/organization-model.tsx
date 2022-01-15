import { Entity } from './entity';
import { ScheduleItemModel } from './schedule-item';

export interface OrganizationModel extends Entity {
  description: string,
  shortName: string,
  scheduleItems: ScheduleItemModel[] | null,
}
