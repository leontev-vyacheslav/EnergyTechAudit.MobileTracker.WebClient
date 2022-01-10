import { TimelineInfoModel } from './timeline-info';
import { MobileDeviceModel } from './mobile-device';
import { TimelineModel } from './timeline';

export type TimelineInfoProps = {
  timeline: TimelineModel,
  mobileDevice: MobileDeviceModel
}

export type TimelineInfoRowProps = {
  item: TimelineInfoModel
}
