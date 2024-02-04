import { PredictPostRequestParams, PredictPostResponseParams, PredictPostResponseParamsValidator } from "@/types/api/predict/loto7"
import { TresureResponseBase } from "@/types/api/tresure_response_base"
import { NextApiRequest } from "next"

// リクエスト
export interface PredictPostRequst extends NextApiRequest {
  body: PredictPostRequestParams
}

// レスポンス
export interface PredictPostResponse extends TresureResponseBase {
  result: PredictPostResponseParams
}
