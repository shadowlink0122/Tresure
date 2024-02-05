import { getAppearance } from '@/libs/search/appearance';
import { getSavedLoto7DataSync } from '@/db/file';
import {
  SearchAppearenceRequestParamsValidator,
  SearchAppearenceResponseParams,
} from '@/types/api/search/loto7/appearence';
import {
  SearchAppearenceRequest,
  SearchAppearenceResponse,
} from '@/interface/api/search/loto7/appearence';
import { NextApiResponse } from 'next';

/**
 * 数字の出現数を出すAPI
 *
 * -- リクエスト --
 * method: POST
 * parameters:
 *  - is_main_number: boolean
 *    - 本番号 もしくは ボーナス番号 を返す
 *  - numbers: [ 1 to 37, unique number ]
 *    - 検索したい数字の配列
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
 *     - [{ number: 検索した数字, result: [検索結果] }]
 */

function PostSearchAppearence(
  req: SearchAppearenceRequest,
  res: NextApiResponse<SearchAppearenceResponse>,
) {
  const requestParams = SearchAppearenceRequestParamsValidator.safeParse(
    req.body,
  );
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
  const loto7Result = getSavedLoto7DataSync()?.reverse();
  if (loto7Result === null) {
    res.status(500).json({
      status: 'NG',
      error_message: "Can't load LOTO7 Result file.",
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
      appearences: res,
    });
  }

  // レスポンス
  res.status(200).json({
    status: 'OK',
    error_message: null,
    result: searchResult,
  });
  return;
}

export default function handler(
  req: SearchAppearenceRequest,
  res: NextApiResponse<SearchAppearenceResponse>,
) {
  switch (req.method) {
    case 'POST':
      // POSTリクエストを通す
      PostSearchAppearence(req, res);
      break;
    default:
      // POSTリクエスト以外はエラー
      res.status(400).json({
        status: 'NG',
        error_message: `Not supported method: ${req.method}.`,
        result: [],
      });
      break;
  }
  return;
}
