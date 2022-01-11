import { LocationRecordDataModel } from './location-record-data';
import { TimelineInfoModel } from './timeline-info';

export type TrackMapInfoWindowProps = {
  locationRecord: LocationRecordDataModel,
  addresses: string[],
  externalDatasheet?: TimelineInfoModel[]
}
