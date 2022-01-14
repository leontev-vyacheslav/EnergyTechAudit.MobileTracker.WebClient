import { Entity } from './entity';

export interface MobileDeviceBackgroundStatusBaseModel extends Entity{
  mobileDeviceId: number,
  serverDateTime: Date
  mobileDeviceDateTime: Date
}
export interface MobileDeviceBackgroundStatusRawModel extends MobileDeviceBackgroundStatusBaseModel {
  statusInfo: string
}

export interface MobileDeviceBackgroundStatusModel extends MobileDeviceBackgroundStatusBaseModel {
  statusInfo: MobileDeviceBackgroundStatusInfoModel
}

type MobileDeviceAppSettings = {
  heatMapClusterRadius: number
  mapMode: number
  markersCompactionReverseRatio: number
  mobileDeviceId: number
  pushNotificationServiceToken: string
  workDate: Date
}

type MobileDeviceAppBackgroundGeolocationSettings = {
  debugSoundEnabled: boolean
  geoTrackingEnabled: boolean
  mobileDeviceId: number
  schedule: string[]
  useSchedule: boolean
}

type AvailableLocationProviders = {
  network: boolean,
  gps: boolean,
  passive: boolean
}

type PowerState = {
  batteryLevel: number,
  lowPowerMode: boolean,
  batteryState: string
}

export type MobileDeviceBackgroundStatusInfoModel = {
  appSettings: MobileDeviceAppSettings,
  appBackgroundGeolocationSettings: MobileDeviceAppBackgroundGeolocationSettings,
  availableLocationProviders: AvailableLocationProviders,
  powerState: PowerState,
  isLocationEnabled: boolean,
  usedMemory: number
}
