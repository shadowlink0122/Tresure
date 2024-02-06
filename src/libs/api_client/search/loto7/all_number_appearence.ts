import { responseHandler } from '../../response_handler';
import { SearchAllNumberAppearenceRequestParams } from '@/types/api/search/loto7/all_number_appearence';
import { SearchAllNumberAppearenceResponse } from '@/interface/api/search/loto7/all_number_appearence';

async function execSearchAllNumberAppearence(
  params: SearchAllNumberAppearenceRequestParams,
): Promise<SearchAllNumberAppearenceResponse> {
  const response = await fetch('/api/search/loto7/all_number_appearence', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return responseHandler<SearchAllNumberAppearenceResponse>(
    response,
    '/api/search/loto7/appearence',
  );
}

export { execSearchAllNumberAppearence };
