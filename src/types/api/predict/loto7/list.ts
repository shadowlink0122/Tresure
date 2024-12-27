import { Loto7ImplementionValidator } from '@/types/loto7';
import {
  PredictPostRequestParamsValidator,
  SavedPredictListValidator,
} from '.';
import {
  PredictResultGetRequestParamsValidator,
  PredictResultGetResponseParamsValidator,
} from './result';
import z from 'zod';

// --- GET ---
// リクエスト
export const PredictListGetRequestQueryValidator =
  PredictResultGetRequestParamsValidator;
export type PredictListGetRequestQuery = z.infer<
  typeof PredictListGetRequestQueryValidator
>;

// レスポンス
export const PredictListGetResponseParamsValidator = z.object({
  implement: Loto7ImplementionValidator,
  result: SavedPredictListValidator,
});
export type PredictListGetResponseParams = z.infer<
  typeof PredictListGetResponseParamsValidator
>;
