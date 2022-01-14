import { IconBaseProps } from 'react-icons/lib/cjs/iconBase';
import { Entity } from './entity';

export interface TimelineInfoModel extends Entity {
  id: number,
  description: string,
  iconRender: (props: IconBaseProps) => JSX.Element,
  value: string
}
