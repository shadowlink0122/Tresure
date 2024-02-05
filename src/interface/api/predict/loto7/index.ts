import {
  PredictGetResponseParams,
  PredictPostRequestParams,
  PredictPostResponseParams,
  PredictPostResponseParamsValidator,
} from '@/types/api/predict/loto7';
import { TresureResponseBase } from '@/types/api/tresure_response_base';
import { NextApiRequest } from 'next';

//--- GET ---
export interface PredictGetRequest extends NextApiRequest {}
export interface PredictGetResponse extends TresureResponseBase {
  result?: PredictGetResponseParams;
}

// --- POST ---
export interface PredictPostRequst extends NextApiRequest {
  body: PredictPostRequestParams;
}
export interface PredictPostResponse extends TresureResponseBase {
  result: PredictPostResponseParams;
}
