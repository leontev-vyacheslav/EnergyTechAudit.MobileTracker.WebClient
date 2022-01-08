import { PopupCallbackModel } from './popup-callback';

export type OrganizationPopupProps = {
  editMode: boolean,
  organization: any,
  callback: ({ ...any }: PopupCallbackModel) => void
}
