import { PredictListGetResponseParams } from '@/types/api/predict/loto7/list';
import { TresureResponseBase } from '@/types/api/tresure_response_base';
import { NextApiRequest } from 'next';

// --- リクエスト ---
export interface PredictListGetRequest extends NextApiRequest {}

// --- レスポンス ---
export interface PredictListGetResponse extends TresureResponseBase {
  result?: PredictListGetResponseParams;
}
