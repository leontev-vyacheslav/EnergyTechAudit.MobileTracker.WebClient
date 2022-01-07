import { ProcFunc } from './primitive-type';

export type SimpleDialogContentModel = {
  iconName: string,
  iconSize: number,
  iconColor: string,
  textRender: any
}

export type SimpleDialogModel = SimpleDialogContentModel & {
  title: string,
  callback: ProcFunc | (() => Promise<void>)
}
