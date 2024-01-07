import { NextApiResponse } from "next";
import {
  SearchInheritanceRequest,
  SearchInheritanceResponse
} from "@/interface/api/search/loto7/inheritance";
import { getSavedLoto7DataSync } from "@/db/file";
import { getInheritanceList } from "@/utility/search/loto7/inheritance";
import { SearchAppearenceRequestParamsValidator } from "@/types/api/search/loto7/appearence";
import { SearchInheritanceRequestParams, SearchInheritanceRequestParamsValidator, SearchInheritanceResponseParams } from "@/types/api/search/loto7/inheritance";

/**
 * 次の回にN個引き継がれる抽選回を取得するAPI
 * 
 * -- リクエスト --
 * method: post
 * parameters:
 *  - inherit: number
 *    - 引き継ぐ個数
 *  - conditions: 'over' | 'more' | 'equal' | 'less' | 'under
 *    - 'over' > N
 *    - 'more' >= N
 *    - 'equal' === N
 *    - 'less' <= N
 *    - 'under' < N
 *  - is_main_number: boolean
 *    - 本番号かボーナス番号
 * -- レスポンス --
 * status_code:
 *  - 200: success
 *  - 400: invalid request
 *  - 500: internal server error
 * content-type:
 *  - application/json
 * body:
 *  - status: 'OK' | 'NG'
 *  - error_message: string | null
 *  - result:
 *     - [ 抽選回のデータ, ... ]
 */

function PostSearchInheritance(
  req: SearchInheritanceRequest,
  res: NextApiResponse<SearchInheritanceResponse>
) {
  const requestParams = SearchInheritanceRequestParamsValidator.safeParse(req.body);
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
    return;
  }
  // データ検索
  const { inherit_count, condition, is_main_number } = req.body;
  const searchResult = getInheritanceList(loto7Result!, inherit_count, condition, is_main_number);
  if (searchResult === null) {
    res.status(400).json({
      status: 'NG',
      error_message: `Invalid condition: ${condition}`,
      result: [],
    });
    return;
  }
  res.status(200).json({
    status: 'OK',
    error_message: null,
    result: searchResult!,
  });
  return;
}

export default function handler(
  req: SearchInheritanceRequest,
  res: NextApiResponse<SearchInheritanceResponse>
) {
  switch (req.method) {
    case 'POST':
      // POSTリクエストを通す
      PostSearchInheritance(req, res);
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
