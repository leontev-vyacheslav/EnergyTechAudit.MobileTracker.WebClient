import { Entity } from './entity';

export interface OfficeOrganizationPopupModel extends Entity{
  organizationId: number
  placeId: number
  address: string
  organization: null
  place: null
}
