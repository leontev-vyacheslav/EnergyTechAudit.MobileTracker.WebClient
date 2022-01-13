export type OrganizationModel = {
  id: number,
  description: string,
  shortName: string,
  offices: any[] | null,
  users: any[] | null,
  scheduleItems: any[] | null,
  organizationLinkScheduleItems: any[] | null
}
