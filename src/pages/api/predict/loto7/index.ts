import { PredictPostRequst } from "@/interface/api/predict/loto7";
import { PredictPostResponse } from "@/interface/api/predict/loto7";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * ロト７の予想を取得するAPI
 * 予想と、それに関連するデータを返す
 * 
 * --- リクエスト ---
 * パラメータに以下を含める
 *  - 実行する回数
 *  - 抽選に必要な数
 *  - 抽選基準を設ける
 * 
 * method: POST
 * params:
 *  - quantity: number
 *    - 実行する回数
 *  - necessary: number[]
 *    - 必ず入れる数
 *      - 7個未満: 必ず抽選に含まれる
 *      - 7個: 抽選は一回のみ ( quantity > 1: error )
 *      - 8個以上: この数だけで抽選を行う
 *  - exclude: number[]
 *    - 除外する数
 *      - 最大: 20
 *      - necessary の数字とは1個も被らない
 *  - dispersion: { terms: number | undefined, reverse: boolean | undefined } | undefined
 *    - terms: 0 < 出現分布の基準となる期間 <= 抽選回数
 *      - undefined: all
 *    - reverse:
 *      - true: 分布の重みを逆順にする (出てない数字の重みを高くする)
 *      - false | undefined: 分布通りの重みにする
 *    - undefined: 完全ランダムで抽選を行う (すべての重みが1)
 * 
 * --- レスポンス --
 * 以下のデータを返す
 *  - N回分の実行結果
 *    - 抽選結果
 *      - 番号
 *      - 期間内に出た回数
 *      - 期間全体で多い/少ないか
 *      - 最後に出た抽選回情報
 *        - id
 *        - 日付
 *    - 似た出方をした抽選回
 *      - 何個の数字が被っているか
 *      - L回分のデータ
 *        - id
 *        - 日付
 *        - 結果
 * 
 * status code:
 *  - 200: success
 *  - 400: bad request
 *  - 500: internal server error
 * content-type:
 *  - application/json
 * body:
 *  - status: 'OK' | 'NG'
 *  - error_message: string | null
 *  - result:
 *    - [
 *        {
 *          pick_method: 'dispersion' | 'random', // 仕様した抽選方式
 *          result: [
 *            {
 *              numbers: number ( 1 ~ 37 ), // 選ばれた数
 *              amount: 期間内で選ばれた数
 *              frequency: 'most' | 'many' | 'few' | 'less' | undefined, // 期間内で選ばれた量のラベル
 *              last_picked: {  // 最後にこの数字が出た抽選回
 *                id: number, // 第N回
 *                date: Date, // 年月日
 *              },
 *            },
 *            ..., // 合計7桁分
 *            similar_pick: {
 *              count_same_number: number, // 何個の数字が被っているか
 *              has_same_numbers: [
 *                id: number, // 第N回
 *                date: Date, // 年月日
 *                numbers: [ 抽選番号, ... ]
 *              ]
 *            }
 *          ]
 *        },
 *        ... // 実行した回数分のデータ
 *      ]
 */

function PostPredictNumber(
  req: PredictPostRequst,
  res: NextApiResponse<PredictPostResponse>
) { }


export default function handler(
  req: PredictPostRequst,
  res: NextApiResponse<PredictPostResponse>
) {
  switch (req.method) {
    case 'POST':
      // POSTリクエストを通す
      PostPredictNumber(req, res);
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


