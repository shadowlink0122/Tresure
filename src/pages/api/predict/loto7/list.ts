import { NextApiResponse } from 'next';
import { PredictResultGetRequest } from '@/interface/api/predict/loto7/result';
import { PredictResultGetRequestParamsValidator } from '@/types/api/predict/loto7/result';
import { getPredictFileSync } from '@/libs/predict/loto7/access_saved_predicts_file';
import { getSavedLoto7DataSync } from '@/db/file';
import {
  PredictListGetRequest,
  PredictListGetResponse,
} from '@/interface/api/predict/loto7/list';
import { hasSameNumber } from '@/libs/predict/loto7/has_same_number';
import { SavedPredictList } from '@/types/api/predict/loto7';
import { LOTO7 } from '@/types/loto7';

/**
 * 予想と類似した過去の抽選データを取得する
 * @param predictResult 予想データ
 * @param loto7Data 過去の抽選結果
 */
function AddSimilarPick(predictResult: SavedPredictList, loto7Data: LOTO7[]) {
  predictResult.map((result) => {
    result.predict.map((element) => {
      const predictNumbers = element.result.map((item) => item.number);
      const similarPick = hasSameNumber(predictNumbers, loto7Data);
      for (let i = 7; i >= 0; i--) {
        // 被りが大きい順で見る
        if (similarPick[i] !== undefined) {
          element.similar_pick = {
            count_same_number: i,
            has_same_number: similarPick[i].map((item) => {
              return {
                date: item.date,
                id: item.id,
                numbers: item.numbers,
              };
            }),
          };
          // 発見したら終了
          break;
        }
      }
    });
  });
}

/**
 * ユーザの抽選から当選結果を表示する
 *
 * --- リクエスト ---
 * method: GET
 * クエリパラメータ:
 *  - id: number | undefined
 *    - 閲覧する当選結果
 *
 * --- レスポンス ---
 * status code:
 *  - 200: Success
 *  - 400: Bad Request
 *  - 500: Internal Server Error
 * status: 'OK' | 'NG'
 * error_message: string | null
 * result: [
 *   {
 *     rank: 1 ~ 6 | undefined, // １等から６等、ハズレ
 *     numbers: [ // 7桁の数字とその情報
 *       {
 *         number: number, // 数字
 *         is_same: "main" | "bonus" | undefined,
 *       }
 *     ],
 *     dispersion: {
 *       terms: number | undefined,
 *       reverse: boolean | undefined
 *     }
 *   },...
 * ]
 */

function GetPredictList(
  req: PredictResultGetRequest,
  res: NextApiResponse<PredictListGetResponse>,
) {
  const requestQueryId = req.query.id;
  if (requestQueryId !== undefined) {
    // クエリにIDが含まれるときにバリデーションを行う
    const validate = PredictResultGetRequestParamsValidator.safeParse(
      Number(requestQueryId),
    );
    if (!validate.success) {
      res.status(400).json({
        status: 'NG',
        error_message: validate.error.message,
      });
      return;
    }
  } else {
    console.log('requestQuery id is undefined');
  }

  // 当選結果を取得する
  const loto7Data = getSavedLoto7DataSync();
  if (loto7Data === null) {
    res.status(500).json({
      status: 'NG',
      error_message: 'Internal Server Error',
    });
    return;
  }

  // 確認する抽選回
  let requestId = Number(requestQueryId);
  if (requestQueryId === undefined) {
    // パラメータが指定されていなければ、
    // 最新の抽選回の予想を取得する
    requestId = loto7Data.length + 1;
  }

  // 抽選結果を受け取る
  const predictResult = getPredictFileSync(requestId);
  if (predictResult === null) {
    res.status(500).json({
      status: 'OK',
      error_message: "Predict File couldn't open.",
    });
    return;
  }

  // 類似した抽選を付け足す
  AddSimilarPick(predictResult, loto7Data);

  // 結果を返す
  res.status(200).json({
    status: 'OK',
    error_message: null,
    result: {
      implement: requestId.toString(),
      result: predictResult,
    },
  });
  return;
}

export default function handler(
  req: PredictListGetRequest,
  res: NextApiResponse<PredictListGetResponse>,
) {
  switch (req.method) {
    case 'GET':
      // GETリクエストを通す
      GetPredictList(req, res);
      break;
    default:
      // POSTリクエスト以外はエラー
      res.status(400).json({
        status: 'NG',
        error_message: `Not supported method: ${req.method}.`,
      });
      break;
  }
  return;
}
