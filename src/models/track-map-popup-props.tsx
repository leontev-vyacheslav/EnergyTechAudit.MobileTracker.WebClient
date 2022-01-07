import { MobileDeviceModel } from '../pages/mobile-devices/mobile-devices';

export type TrackMapPopupProps = {
  mobileDevice: MobileDeviceModel,
  workDate?: Date,
  onClose: () => void
}
