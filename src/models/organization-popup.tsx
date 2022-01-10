import { OfficeOrganizationPopupModel } from './office-organization-popup';

export type OrganizationPopupModel = {
  id: number,
  description: string | null,
  organizationId: number,
  office: OfficeOrganizationPopupModel | null,
  scheduleItems: any | null,
  shortName: string | null,
}

