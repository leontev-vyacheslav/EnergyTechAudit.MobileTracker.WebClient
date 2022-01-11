export type TreeViewItemModel = {
  expanded: boolean,
  text: string,
  icon: () => JSX.Element,
  path: string | undefined,
  restricted: boolean,
  items?: any[],
  command?: string
} | any
