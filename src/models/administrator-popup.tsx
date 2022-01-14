import { Entity } from './entity';

export interface AdministratorPopupModel extends  Entity {
  email?: string | null,
  organizationId?: number | null,
  editPassword?: string | null,
  isActive: boolean
}
