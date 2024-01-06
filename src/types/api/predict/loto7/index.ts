import { NonNegativeIntNumberValidator, PositiveIntNumberValidator } from '@/types/common';
import { Loto7DateValidator, Loto7ImplementionValidator, Loto7MainNumbersValidator, Loto7NumberValidator, MAX_LOTO7_NUMBER } from '@/types/loto7';
import z from 'zod';
import { AllNumberAppearenceStatusValidator } from '../../search/loto7/all_number_appearence';

// リクエスト
const MaxExcludeNumberLength = 20;
const PredictQuantityValidator = PositiveIntNumberValidator;
const PredictNecessaryNumberValidator = Loto7NumberValidator.array().min(0);
const PredictExcludeNumberValidator = Loto7NumberValidator.array().min(0).max(MaxExcludeNumberLength);
export const PredictDispersionParamsValidator = z.object({
  terms: PositiveIntNumberValidator.optional(),
  reverse: z.boolean().optional(),
}).optional();
export type PredictDispersionParams = z.infer<typeof PredictDispersionParamsValidator>;

export const PredictPostRequestParamsValidator = z.object({
  quantity: PredictQuantityValidator,
  necessary: PredictNecessaryNumberValidator,
  exclude: PredictExcludeNumberValidator,
  dispersion: PredictDispersionParamsValidator
}).refine(args => {
  const { quantity, necessary, exclude } = args;
  // 必要数7個で抽選回数が1ではない時, エラー
  if (necessary.length === 7 && quantity !== 1) return false;
  // 必要数と除外数に被りがあるとき, エラー
  if (necessary.filter(item => exclude.indexOf(item) !== -1).length > 0) return false;
  return true;
});
export type PredictPostRequestParams = z.infer<typeof PredictPostRequestParamsValidator>;

// レスポンス
// 抽選結果
export const PredictPickMethodValidator = z.enum(['dispersion', 'random']);
export type PredictPickMethod = z.infer<typeof PredictPickMethodValidator>;
export const PredictLastPickedParamsValidator = z.object({
  id: Loto7ImplementionValidator,
  date: Loto7DateValidator
});
export type PredictLastPickedParams = z.infer<typeof PredictLastPickedParamsValidator>;
const PredictNumberValidator = PositiveIntNumberValidator.max(MAX_LOTO7_NUMBER);
const PredictNumberAmountValidator = NonNegativeIntNumberValidator;
const PredictPickedNumberParamsValidator = z.object({
  number: PredictNumberValidator,
  amount: PredictNumberAmountValidator,
  frequency: AllNumberAppearenceStatusValidator,
  last_picked: PredictLastPickedParamsValidator,
}).array().length(7);
export type PredictPickedNumberParams = z.infer<typeof PredictPickedNumberParamsValidator>;
// 類似した抽選
export const PredictHasSameNumbersParamsValidator = z.object({
  id: Loto7ImplementionValidator,
  date: Loto7DateValidator,
  numbers: Loto7MainNumbersValidator
});
export type PredictHasSameNumbersParams = z.infer<typeof PredictHasSameNumbersParamsValidator>;
export const PredictSimilarPickParamsValidator = z.object({
  count_same_number: NonNegativeIntNumberValidator,
  has_same_number: PredictHasSameNumbersParamsValidator.array()
});
export type PredictSimilarPickParams = z.infer<typeof PredictSimilarPickParamsValidator>;
export const PredictResultParamsValidator = z.object({
  pick_method: PredictPickMethodValidator,
  result: PredictPickedNumberParamsValidator,
  similar_pick: PredictSimilarPickParamsValidator
});
export type PredictResultParams = z.infer<typeof PredictResultParamsValidator>;

export const PredictPostResponseParamsValidator = PredictResultParamsValidator.array();
export type PredictPostResponseParams = z.infer<typeof PredictPostResponseParamsValidator>;
