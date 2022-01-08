import { MobileDeviceModel } from './mobile-device';

export type TrackMapPopupProps = {
  mobileDevice: MobileDeviceModel,
  workDate?: Date,
  onClose: () => void
}
