import { TimelineInfoModel } from './timeline-info';
import { MobileDeviceModel } from './mobile-device';

export type TimelineInfoProps = {
  timeline: any,
  mobileDevice: MobileDeviceModel
}

export type TimelineInfoRowProps = {
  item: TimelineInfoModel
}
