import { TresureResponseBase } from '@/types/api/tresure_response_base';
import { NextApiRequest } from 'next';
import {
  SearchAppearenceRequestParams,
  SearchAppearenceResponseParams,
} from '@/types/api/search/loto7/appearence';

export interface SearchAppearenceRequest extends NextApiRequest {
  body: SearchAppearenceRequestParams;
}

export interface SearchAppearenceResponse extends TresureResponseBase {
  result: SearchAppearenceResponseParams;
}
