import { PositiveIntNumberValidator } from '@/types/common';
import {
  Loto7ImplementionValidator,
  Loto7NumberValidator,
} from '@/types/loto7';
import z from 'zod';
import {
  PredictDispersionParamsValidator,
  PredictPickMethodValidator,
} from '.';

// --- リクエスト ---
export const PredictResultGetRequestParamsValidator =
  PositiveIntNumberValidator.optional();
export type PredictResultGetRequestParams = z.infer<
  typeof PredictResultGetRequestParamsValidator
>;

// --- レスポンス ---
export const PredictResultRankParamsValidator =
  PositiveIntNumberValidator.max(6).optional();
export type PredictResultRankParams = z.infer<
  typeof PredictResultRankParamsValidator
>;
export const PredictResultIsSameParamsValidator = z
  .enum(['main', 'bonus'])
  .optional();
export type PredictResultIsSameParams = z.infer<
  typeof PredictResultIsSameParamsValidator
>;
export const PredictResultNumbersParamsValidator = z.object({
  number: Loto7NumberValidator,
  is_same: PredictResultIsSameParamsValidator,
});
export type PredictResultNumbersParams = z.infer<
  typeof PredictResultNumbersParamsValidator
>;

export const PredictResultParamsValidator = z.object({
  rank: PredictResultRankParamsValidator.optional(),
  numbers: PredictResultNumbersParamsValidator.array(),
  pick_method: PredictPickMethodValidator,
  dispersion: PredictDispersionParamsValidator,
});
export type PredictResultParams = z.infer<typeof PredictResultParamsValidator>;

export const PredictResultGetResponseParamsValidator = z.object({
  implement: Loto7ImplementionValidator,
  result: PredictResultParamsValidator.array(),
});
export type PredictResultGetResponseParams = z.infer<
  typeof PredictResultGetResponseParamsValidator
>;
