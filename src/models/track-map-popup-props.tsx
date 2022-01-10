import { MobileDeviceModel } from './mobile-device';
import { PopupCallbackModel } from './popup-callback';

export type TrackMapPopupProps = {
  mobileDevice: MobileDeviceModel,
  workDate?: Date,
  callback: ({ ...any }: PopupCallbackModel) => void
}
