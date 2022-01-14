import { MobileDeviceModel } from './mobile-device';
import { ExtendedUserInfoModel } from './extended-user-info';
import { Entity } from './entity';

export interface UserModel extends Entity {
  roleId: number,
  organizationId: number | null,
  email: string,
  password: string,
  isActive: boolean,
  createUserId: number,
  updateUserId: number,
  createDate: Date,
  updateDate: Date
  organization: any | null,
  mobileDevices: MobileDeviceModel[]
  extendedUserInfo: ExtendedUserInfoModel | null
}
