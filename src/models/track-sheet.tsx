import { DailyCoveredDistanceModel } from './daily-covered-distance';

export type TrackSheetModel = {
  totalCoveredDistance: number,
  dailyCoveredDistances: DailyCoveredDistanceModel[]
}
