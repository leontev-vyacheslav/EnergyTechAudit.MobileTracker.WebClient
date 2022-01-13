import { PopupCallbackModel } from './popup-callback';
import { OrganizationOfficesModel } from './organization-popup';

export type OfficePopupProps = {
  editMode: boolean,
  organization: OrganizationOfficesModel,
  callback: ({ ...any }: PopupCallbackModel) => void
}
