import { TimelineInfoModel } from './timeline-info';
import { MobileDeviceModel } from '../pages/mobile-devices/mobile-devices';

export type TimelineInfoProps = {
  timeline: any,
  mobileDevice: MobileDeviceModel
}

export type TimelineInfoRowProps = {
  item: TimelineInfoModel
}
