export type MobileDeviceModel = {
  id: number,
  deviceUid: string
  email: string,
  extendedUserInfo: MobileDeviceExtendedUserInfoModel
  model: string
  os: string
  registrationDate: string
  userId: number
} | null

export type MobileDeviceExtendedUserInfoModel = {
  id: number,
  firstName: string,
  lastName: string
}
