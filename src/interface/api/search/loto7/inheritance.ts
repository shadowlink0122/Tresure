import { TresureResponseBase } from '@/types/api/tresure_response_base';
import { NextApiRequest } from 'next';
import {
  SearchInheritanceRequestParams,
  SearchInheritanceResponseParams
} from '@/types/api/search/loto7/inheritance';

// リクエスト
export interface SearchInheritanceRequest extends NextApiRequest {
  body: SearchInheritanceRequestParams,
}

// レスポンス
export interface SearchInheritanceResponse extends TresureResponseBase {
  result: SearchInheritanceResponseParams
};

