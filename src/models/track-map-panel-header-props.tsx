import { ReactNode } from 'react';

export type TrackMapPanelHeaderProps = {
  title: string,
  icon: () => ReactNode,
  onClose: () => void
}
