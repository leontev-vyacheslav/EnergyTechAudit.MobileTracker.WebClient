import { ProcFunc } from './primitive-type';

export type SharedAreaContextModel = {
  signOutWithConfirm: ProcFunc,
  showWorkDatePicker: ProcFunc,
  showLoader: ProcFunc,
  hideLoader: ProcFunc
} | any;
