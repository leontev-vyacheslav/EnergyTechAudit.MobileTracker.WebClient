import { Entity } from './entity';

export interface MobileDeviceModel extends Entity {
  deviceUid: string
  email: string,
  extendedUserInfo: MobileDeviceExtendedUserInfoModel
  model: string
  os: string
  registrationDate: string
  userId: number
}

export interface MobileDeviceExtendedUserInfoModel extends Entity {
  firstName: string,
  lastName: string
}
