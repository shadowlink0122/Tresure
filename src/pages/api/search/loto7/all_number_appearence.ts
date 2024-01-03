import { getSavedLoto7DataSync } from '@/db/file';
import { SearchAllNumberAppearenceRequest, SearchAllNumberAppearenceResponse } from '@/interface/api/search/loto7/all_number_appearence';
import { NextApiResponse } from 'next';
import { SearchAllNumberAppearenceRequestParamsValidator, SearchAllNumberAppearenceResponseParams } from '@/types/api/search/loto7/all_number_appearence';
import { getAllNumberAppearence } from '@/libs/search/loto7/all_number_appearence';

/**
 * 指定期間で出現した数字とその回数を返します
 * 
 * -- リクエスト --
 * method: POST
 * parameters:
 *  - terms: number
 *    - 直近N回分のデータ: 最小5
 *  - is_main_number: boolean
 *    - 本番号かボーナス番号
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
 *  - result: [{ number: 1, count: 回数, volume: 割合 }, ..., { number: 37, count: 回数 }]
 *    - number: number
 *      - 抽選の数字
 *    - count: number
 *      - 出てきた回数
 *    - volume: 'most' | 'many' | 'few' | 'less' | undefined
 *      - 割合、多い・少ない count を 1~2 個取得する
 */

function PostSearchAllNumberAppearence(
  req: SearchAllNumberAppearenceRequest,
  res: NextApiResponse<SearchAllNumberAppearenceResponse>
) {
  const requestParams = SearchAllNumberAppearenceRequestParamsValidator.safeParse(req.body);
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
  const { is_main_number, terms } = req.body;
  const searchResult: SearchAllNumberAppearenceResponseParams =
    getAllNumberAppearence(loto7Result!.slice(0, terms), is_main_number);

  // レスポンス
  res.status(200).json({
    status: 'OK',
    error_message: null,
    result: searchResult
  });
  return;
}

export default function handler(
  req: SearchAllNumberAppearenceRequest,
  res: NextApiResponse<SearchAllNumberAppearenceResponse>
) {
  switch (req.method) {
    case 'POST':
      // POSTリクエストを通す
      PostSearchAllNumberAppearence(req, res);
      break;
    default:
      // POSTリクエスト以外はエラー
      res.status(400).json({
        status: 'NG',
        error_message: `Not supported method: ${req.method}.`,
        result: []
      });
      break;
  }
  return;
}

