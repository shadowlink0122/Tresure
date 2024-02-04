import { responseHandler } from "../../response_handler";
import { PredictResultGetResponse } from "@/interface/api/predict/loto7/result";
import { PredictResultGetRequestParams } from "@/types/api/predict/loto7/result";

async function execPredictResultGetRequest(params: string | undefined): Promise<PredictResultGetResponse> {
  let queryParams = '';
  if (params !== undefined) queryParams = `id=${params}`;
  const response = await fetch(`/api/predict/loto7/result?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return responseHandler<PredictResultGetResponse>(response, `/api/predict/loto7/result?${queryParams}`);
}

export {
  execPredictResultGetRequest
}
