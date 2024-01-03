import z from 'zod';
import { PositiveIntNumberValidator } from '@/types/common';
import { Loto7Validator, Loto7IdValidator } from '@/types/loto7';
import { NextApiRequest } from 'next';
import { TresureResponseBase } from '../tresure_response_base';

// id指定で撮る場合
export const GetLoto7HistoryIdParamsValidator = z.object({
  ids: Loto7IdValidator.array(),
}).optional();
export type GetLoto7HistoryIdParams = z.infer<typeof GetLoto7HistoryIdParamsValidator>

// N回目~M個指定で撮る場合
const GetLoto7HistoryNumberParamsValidator = z.object({
  from: PositiveIntNumberValidator.optional(),// 1以上
  times: PositiveIntNumberValidator.optional(),
}).optional();
export type GetLoto7HistoryNumberParams = z.infer<typeof GetLoto7HistoryNumberParamsValidator>

// 期間で撮る場合
const GetLoto7HistoryTermParamsValidator = z.object({
  since: z.string().datetime().optional(),
  until: z.string().datetime().optional(),
}).optional();
export type GetLoto7HistoryTermParams = z.infer<typeof GetLoto7HistoryTermParamsValidator>

// リクエスト型
export const GetLoto7HistoryRequestParamsValidator = z.object({
  type_id: GetLoto7HistoryIdParamsValidator,
  type_number: GetLoto7HistoryNumberParamsValidator,
  type_term: GetLoto7HistoryTermParamsValidator
});
type GetLoto7HistoryRequestParams = z.infer<typeof GetLoto7HistoryRequestParamsValidator>;
export interface GetLoto7HistoryRequest extends NextApiRequest {
  body: GetLoto7HistoryRequestParams,
}

// レスポンス型
const GetLoto7HistoryResponseParamsValidator = Loto7Validator.array();
type GetLoto7HistoryResponseParams = z.infer<typeof GetLoto7HistoryResponseParamsValidator>;
export interface GetLoto7HistoryResponse extends TresureResponseBase {
  result: GetLoto7HistoryResponseParams
};
