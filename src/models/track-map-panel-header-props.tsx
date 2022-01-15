import { IconBaseProps } from 'react-icons';

export type TrackMapPanelHeaderProps = {
  title: string,
  iconRender: (props: IconBaseProps) => JSX.Element,
  onClose: () => void
}
