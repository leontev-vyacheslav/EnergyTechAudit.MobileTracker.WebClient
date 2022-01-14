import { PopupCallbackModel } from './popup-callback';
import { OrganizationOfficesModel } from './organization-popup';

export type OrganizationPopupProps = {
  editMode: boolean,
  organization: OrganizationOfficesModel,
  callback: ({ ...any }: PopupCallbackModel) => void
}
