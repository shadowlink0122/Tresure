import { getAppearance } from '@/analyze/loto7/appearance';
import { getSavedLoto7DataSync } from '@/db/file';
import {
  SearchAppearenceRequest,
  SearchAppearenceRequestParamsValidator,
  SearchAppearenceResponse
} from '@/types/api/loto7/analyze/appearence';
import { NextApiResponse } from 'next';
import { SearchAppearenceResponseParams } from '@/types/api/loto7/analyze/appearence';

/**
 * 数字の出現数を出すAPI
 * 
 * -- リクエスト --
 * method: POST
 * parameters:
 *  - main_number: boolean
 *    - 本番号 もしくは ボーナス番号 を返す
 *  - numbers: [ 1 to 37, unique number ]
 *    - 検索したい数字
 * 
 * -- レスポンス --
 * status_code:
 *  - 200: success
 *  - 400: bad request
 *  - 500: internal server error
 * content-type:
 *  - application/json
 * body:
 *  - status: 'OK' | 'NG'
 *  - error_message: string | null
 *  - result:
 *     - [{
 *          number: 検索した数字
 *          result: [検索結果]
 *       }]
 */

function PostSearchAppearence(
  req: SearchAppearenceRequest,
  res: NextApiResponse<SearchAppearenceResponse>
) {
  const requestParams = SearchAppearenceRequestParamsValidator.safeParse(req.body);
  if (!requestParams.success) {
    // バリデーションが失敗した場合
    res.status(400).json({
      status: 'NG',
      error_message: `Invalid request: ${requestParams.error}`,
      result: [],
    });
    return;
  }

  // バリデーション成功
  // ファイル読み込み
  const loto7Result = getSavedLoto7DataSync();
  if (loto7Result === null) {
    res.status(500).json({
      status: 'NG',
      error_message: 'Can\'t load LOTO7 Result file.',
      result: [],
    });
  }
  // データ検索
  const { is_main_number, numbers } = req.body;
  const searchResult: SearchAppearenceResponseParams = [];
  for (const num of numbers) {
    const res = getAppearance(loto7Result!, num, is_main_number);
    searchResult.push({
      number: num,
      result: res
    });
  }

  // レスポンス
  res.status(200).json({
    status: 'OK',
    error_message: null,
    result: searchResult
  });
  return;
}

export default function handler(
  req: SearchAppearenceRequest,
  res: NextApiResponse<SearchAppearenceResponse>
) {
  switch (req.method) {
    case 'POST':
      PostSearchAppearence(req, res);
      break;
    default:
      res.status(400).json({
        status: 'NG',
        error_message: `Not supported method: ${req.method}.`,
        result: []
      });
      break;
  }
  return;
}

