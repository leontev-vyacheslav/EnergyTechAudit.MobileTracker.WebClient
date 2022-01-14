import { OfficeOrganizationPopupModel } from './office-organization-popup';
import { Entity } from './entity';

export interface OrganizationOfficesModel extends Entity {
  id: number,
  description: string | null,
  organizationId: number,
  office: OfficeOrganizationPopupModel | null,
  scheduleItems: any | null,
  shortName: string | null,
}

