import { PopupCallbackModel } from './popup-callback';

export type TrackSheetPopupProps = {
  currentDate: Date,
  callback: ({ ...any }: PopupCallbackModel) => void
}
