import { AdministratorPopupModel } from './administrator-popup';
import { PopupCallbackModel } from './popup-callback';

export type AdministratorPopupProps = {
  editMode: boolean,
  administrator: AdministratorPopupModel,
  callback: ({ ...any }: PopupCallbackModel) => void
}
