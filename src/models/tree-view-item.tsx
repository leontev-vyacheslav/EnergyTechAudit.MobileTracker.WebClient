export type TreeViewItemModel = {
  expanded: boolean,
  text: string,
  icon: () => JSX.Element,
  path: string | undefined,
  restricted: boolean,
  items?: TreeViewItemModel[],
  command?: string
} | any
