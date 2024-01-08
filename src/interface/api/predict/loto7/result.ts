import { PredictResultGetResponseParams } from "@/types/api/predict/loto7/result";
import { TresureResponseBase } from "@/types/api/tresure_response_base";
import { NextApiRequest } from "next";


// --- リクエスト ---
export interface PredictResultGetRequest extends NextApiRequest {
};

// --- レスポンス ---
export interface PredictResultGetResponse extends TresureResponseBase {
  result?: PredictResultGetResponseParams
}
