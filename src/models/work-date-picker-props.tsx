import { EventInfo } from 'devextreme/events';
import dxDateBox from 'devextreme/ui/date_box';

export type WorkDatePickerProps = {
  innerRef?: any,
  onClosed: ((e: EventInfo<dxDateBox>) => void) | undefined
}
