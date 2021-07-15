import { IField } from './ifield'
import { IMove } from './imove';

export interface IChessAI {
  getRecommendMove(field: IField, method?: string): IMove | null;
}