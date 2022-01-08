import { PopupCallbackModel } from './popup-callback';

export type OfficePopupProps = {
  editMode: boolean,
  organization: any,
  callback: ({ ...any }: PopupCallbackModel) => void
}
