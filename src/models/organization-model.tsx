import { Entity } from './entity';

export interface OrganizationModel extends Entity {
  id: number,
  description: string,
  shortName: string,
  offices: any[] | null,
  users: any[] | null,
  scheduleItems: any[] | null,
  organizationLinkScheduleItems: any[] | null
}
