import { responseHandler } from "../../response_handler";
import { PredictPostRequestParams } from "@/types/api/predict/loto7";
import { PredictPostResponse } from "@/interface/api/predict/loto7";

async function execPredictPostRequest(params: PredictPostRequestParams): Promise<PredictPostResponse> {
  const response = await fetch('/api/predict/loto7/', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return responseHandler<PredictPostResponse>(response, '/api/predict/loto7/');
}

export {
  execPredictPostRequest
}
