export type TrackMapLocationRecordsContextModel = {
  trackLocationRecordList: TrackLocationRecordModel[]
}

export type TrackLocationRecordModel = {
  id: number,
  accuracy: number,
  heading: number,
  speed: number,
  mobileDeviceDateTime: Date,
  latitude: number,
  longitude: number
}

