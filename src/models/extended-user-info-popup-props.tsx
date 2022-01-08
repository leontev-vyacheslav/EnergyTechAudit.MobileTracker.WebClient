import { PopupCallbackModel } from './popup-callback';

export type ExtendedUserInfoPopupProps = {
  userId: number,
  callback: ({ ...any }: PopupCallbackModel) => void
}
