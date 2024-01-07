import { SearchAppearenceResponse } from "@/interface/api/search/loto7/appearence";
import { SearchAppearenceRequestParams } from "@/types/api/search/loto7/appearence";
import { responseHandler } from "../../response_handler";

async function execSearchAppearence(params: SearchAppearenceRequestParams): Promise<SearchAppearenceResponse> {
  const response = await fetch('/api/search/loto7/appearence', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return responseHandler<SearchAppearenceResponse>(response, '/api/search/loto7/appearence');
}

export {
  execSearchAppearence
}
