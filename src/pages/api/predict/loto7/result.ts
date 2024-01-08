import { NextApiResponse } from "next";
import { PredictResultGetRequest, PredictResultGetResponse } from "@/interface/api/predict/loto7/result";
import { PredictResultGetRequestParamsValidator, PredictResultGetResponseParams } from "@/types/api/predict/loto7/result";
import { getPredictFileSync } from "@/libs/predict/loto7/access_saved_predicts_file";
import { getSavedLoto7DataSync } from "@/db/file";
import { getWinningData } from "@/libs/predict/loto7/winning_data";

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
 *     ]
 *   },...
 * ]
 */

function GetPredictResult(
  req: PredictResultGetRequest,
  res: NextApiResponse<PredictResultGetResponse>
) {
  const requestQueryId = req.query['id'];
  if (requestQueryId !== undefined) {
    // クエリにIDが含まれるときにバリデーションを行う
    const validate = PredictResultGetRequestParamsValidator.safeParse(Number(requestQueryId));
    if (!validate.success) {
      res.status(400).json({
        status: 'NG',
        error_message: validate.error.message
      });
      return;
    }
  }

  // 当選結果を取得する
  const loto7Data = getSavedLoto7DataSync();
  if (loto7Data === null) {
    res.status(500).json({
      status: 'NG',
      error_message: 'Internal Server Error'
    });
    return;
  }

  // 確認する抽選回
  let requestId = Number(requestQueryId);
  if (requestQueryId === undefined) {
    // パラメータが指定されていなければ、
    // 最新の抽選回の予想を取得する
    requestId = loto7Data.length - 1;
  }

  // 未抽選の場合はエラーにする
  if (loto7Data[requestId - 1] === undefined) {
    res.status(400).json({
      status: 'NG',
      error_message: '未抽選です'
    });
    return;
  }

  // 抽選結果を受け取る
  const predictResult = getPredictFileSync(requestId);

  // 当選確認を行う
  const winningDataArray: PredictResultGetResponseParams = [];
  if (predictResult !== null) {
    predictResult.map(item => {
      for (const predict of item.predict) {
        const res = getWinningData(loto7Data[requestId - 1], predict);
        // 当選しているものとしていないものを分ける
        if (res.rank !== undefined) winningDataArray.push(res);
      }
    });
  }

  // 当選順にソートする
  winningDataArray.sort((a, b) => a.rank! - b.rank!);

  // 当選したものだけ結果を返す
  const result: PredictResultGetResponseParams = [
    ...winningDataArray,
  ];

  // あたり順にソートする
  // 結果を返す
  res.status(200).json({
    status: 'OK',
    error_message: null,
    result: result
  });
  return;
}

export default function handler(
  req: PredictResultGetRequest,
  res: NextApiResponse<PredictResultGetResponse>
) {
  switch (req.method) {
    case 'GET':
      // GETリクエストを通す
      GetPredictResult(req, res);
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



