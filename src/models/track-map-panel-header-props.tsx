import { IconBaseProps } from 'react-icons';
import { ProcFunc } from './primitive-type';

export type TrackMapPanelHeaderProps = {
  title: string,
  iconRender: (props: IconBaseProps) => JSX.Element,
  onClose: ProcFunc
}
