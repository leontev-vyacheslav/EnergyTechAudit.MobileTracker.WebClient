import { IconBaseProps } from 'react-icons/lib/cjs/iconBase';

export type TimelineInfoModel = {
  id: number,
  description: string,
  iconRender: (props: IconBaseProps) => JSX.Element,
  value: string
}
