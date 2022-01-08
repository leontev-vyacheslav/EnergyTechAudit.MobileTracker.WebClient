import { ProcFunc } from './primitive-type';
import { RefObject } from 'react';
import TreeView from 'devextreme-react/tree-view';

export type SharedAreaContextModel = {
  signOutWithConfirm: ProcFunc,
  showWorkDatePicker: ProcFunc,
  showLoader: ProcFunc,
  hideLoader: ProcFunc,
  treeViewRef: RefObject<TreeView<any>>
};
