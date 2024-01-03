import { getSavedLoto7DataSync } from '@/db/file';
import {
  InfoRequest,
  InfoRequestParamsValidator,
  InfoResponse
} from '@/types/api/loto7/info';
import { NextApiResponse } from 'next';
import { findByNumber, findByTerm } from '@/utils/info';
import { LOTO7 } from '@/types/loto7';

/**
 * 数字の出現数を出すAPI
 * 
 * -- リクエスト --
 * method: POST
 * parameters:
 *  - main_number: boolean
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

function PostInfo(
  req: InfoRequest,
  res: NextApiResponse<InfoResponse>
) {
  const requestParams = InfoRequestParamsValidator.safeParse(req.body);

  if (!requestParams.success) {
    // バリデーションが失敗した場合
    res.status(400).json({
      status: 'NG',
      error_message: `Invalid request: ${requestParams.error.message}`,
      result: [],
    });
    return;
  }

  // バリデーション成功
  // ファイル読み込み
  const loto7Result = getSavedLoto7DataSync() as LOTO7[];
  if (loto7Result === null) {
    res.status(500).json({
      status: 'NG',
      error_message: 'Can\'t load LOTO7 Result file.',
      result: [],
    });
    return;
  }

  let resLoto7Result: LOTO7[] | null = [];
  const { type_number, type_term } = req.body;
  if (type_number) {
    // データの個数を指定
    resLoto7Result = findByNumber(loto7Result!, type_number)
  } else if (type_term) {
    // データの日時を指定
    resLoto7Result = findByTerm(loto7Result!, type_term);
  } else {
    // エラー
    res.status(400).json({
      status: 'NG',
      error_message: `Invalid request param`,
      result: [],
    });
    return;
  }
  // ２つの条件で検索できなかったとき
  if (!resLoto7Result) {
    // エラー
    res.status(400).json({
      status: 'NG',
      error_message: `Data Not Found`,
      result: [],
    });
    return;
  }

  // setDefaultParams(loto7Result!, req.body)
  console.log("row", req.body)

  // レスポンス
  res.status(200).json({
    status: 'OK',
    error_message: null,
    result: resLoto7Result
  });
  return;
}

export default function handler(
  // 何のInfo?になるから、長くても変数名はちゃんとつけてほしい
  // (動詞)(名詞 | 複合名詞)Request
  // 例: GetLoto7ResultRequest, GetLoto7HistoryRequest
  req: InfoRequest,
  res: NextApiResponse<InfoResponse>
) {
  switch (req.method) {
    case 'POST':
      // POSTリクエストを通す
      PostInfo(req, res);
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

