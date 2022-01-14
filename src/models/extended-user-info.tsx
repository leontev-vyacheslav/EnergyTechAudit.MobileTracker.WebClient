import { Entity } from './entity';

export interface ExtendedUserInfoModel extends Entity {
  firstName: string,
  lastName: string,
  birthDate: Date | null,
  phone: string,
  officeId: number | null
  office: any | null,
  user: object | null
}
