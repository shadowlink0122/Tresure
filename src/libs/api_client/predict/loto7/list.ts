import { PredictListGetResponse } from '@/interface/api/predict/loto7/list';
import { responseHandler } from '../../response_handler';

async function execPredictListGetRequest(
  params: string | undefined,
): Promise<PredictListGetResponse> {
  let queryParams = '';
  if (params !== undefined) queryParams = `id=${params}`;
  console.log(`queryParams: ${queryParams}`);
  const response = await fetch(`/api/predict/loto7/list?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return responseHandler<PredictListGetResponse>(
    response,
    `/api/predict/loto7/list?${queryParams}`,
  );
}

export { execPredictListGetRequest };
