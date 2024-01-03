import { SearchAllNumberAppearenceRequestParams, SearchAllNumberAppearenceResponseParams } from '@/types/api/search/loto7/all_number_appearence';
import { TresureResponseBase } from '@/types/api/tresure_response_base';
import { NextApiRequest } from "next";


export interface SearchAllNumberAppearenceRequest extends NextApiRequest {
  body: SearchAllNumberAppearenceRequestParams,
}

export interface SearchAllNumberAppearenceResponse extends TresureResponseBase {
  result: SearchAllNumberAppearenceResponseParams
};

