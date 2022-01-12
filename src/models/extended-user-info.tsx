export type ExtendedUserInfoModel = {
  id: number,
  firstName: string,
  lastName: string,
  birthDate: Date | null,
  phone: string,
  officeId: number | null
  office: any | null,
  user: object | null
}
