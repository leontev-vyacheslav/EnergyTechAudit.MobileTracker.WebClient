export type DailyCoveredDistanceModel = {
  id: number,
  mobileDeviceId: number,
  userId: number,
  date: Date,
  distance: number
  averageAccuracy: number
  samplesNumber: number
}
