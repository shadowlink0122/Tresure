import { getSavedLoto7DataSync } from "@/db/file";
import { PredictPostRequst } from "@/interface/api/predict/loto7";
import { PredictPostResponse } from "@/interface/api/predict/loto7";
import { PredictHasSameNumbersParams, PredictPickMethod, PredictPostRequestParams, PredictPostRequestParamsValidator, PredictPostResponseParamsValidator, PredictResultParams, PredictSimilarPickParams } from "@/types/api/predict/loto7";
import { MAX_LOTO7_NUMBER } from "@/types/loto7";
import { NextApiResponse } from "next";
import { NumberDispersion, predict } from "@/libs/predict/loto7";
import { getAllNumberAppearence } from "@/libs/search/loto7/all_number_appearence";
import { getAppearance } from "@/libs/search/appearance";
import { hasSameNumber } from "@/libs/predict/loto7/has_same_number";
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
) {
  const requestBody = req.body;
  // リクエストボディのバリデーション
  const validateRequest = PredictPostRequestParamsValidator.safeParse(requestBody);
  if (!validateRequest.success) {
    res.status(400).json({
      status: 'NG',
      error_message: validateRequest.error.message,
      result: []
    });
    return;
  }
  // --- 抽選に必要な数字を設定する ---
  const { quantity, necessary, exclude, dispersion } = requestBody;
  // 必要な数字を重み1で初期化する
  const necessaryNumbers: NumberDispersion[] = necessary.map((item) => {
    return {
      number: item,
      weight: 1
    } as NumberDispersion;
  });
  // 1 ~ 37の数字をあらかじめランダム抽選の候補に入れておく
  // 必要な数字が7個以上あれば空にする
  let randomChoosedNumbers: NumberDispersion[] =
    (necessaryNumbers.length >= 7) ?
      [] :
      [...Array(MAX_LOTO7_NUMBER)].map((_, i) => {
        return {
          number: i + 1,
          weight: 1
        } as NumberDispersion;
      });

  // 必要数が7未満の時、必要数/除外数以外の数字が選ばれるようにする
  // それ以外の時は必要数から選ばれるので、この分岐に入らない
  if (necessary.length < 7) {
    // 除外する数字のindexを取得する
    const getIndexFromNumber = (target: number) => {
      for (let i = 0; i < randomChoosedNumbers.length; i += 1) {
        if (randomChoosedNumbers[i].number === target) return i;
      }
      return -1;
    }
    // ランダムに選ばれない数字
    const excludeRandomChoose: number[] = [...necessary, ...exclude];
    console.log(excludeRandomChoose);
    excludeRandomChoose.map(item => {
      randomChoosedNumbers = randomChoosedNumbers.filter(i => i.number !== item);
    });
  }
  // --- 抽選の重みを設定する ---
  // 過去のデータを取得する
  const loto7Data = getSavedLoto7DataSync();
  if (loto7Data === null) {
    // ファイルが取得できなければエラー
    res.status(500).json({
      status: 'NG',
      error_message: 'Internal Server Error: Can\'t read loto7 file.',
      result: []
    });
    return;
  }
  let useLoto7Data = loto7Data!.reverse();
  // undefinedの場合はランダム(すべての重みが1)
  let terms = undefined;
  let reverse = undefined
  let pickMethod: PredictPickMethod = 'random';
  // 重みあり抽選
  if (dispersion !== undefined) {
    pickMethod = 'dispersion';
    terms = dispersion.terms;
    reverse = dispersion.reverse;
    // 期間が設定されていなければ、全体を指定する
    if (terms === undefined) terms = useLoto7Data.length;
    // 重みの逆転が設定されていなければ、出現率を使用する
    if (reverse === undefined) reverse = false;

    // 重みに使用するデータを区切る
    // termsが範囲外の場合はデータ数に合わせる
    useLoto7Data = useLoto7Data.slice(
      0,
      Math.min(
        useLoto7Data.length,
        terms
      )
    );
    // --- update weight ---
    const allNumberAppearence = getAllNumberAppearence(useLoto7Data, true);
    allNumberAppearence.map(appear => {
      necessaryNumbers.map(nec => {
        if (nec.number === appear.number) nec.weight += appear.count
      });
      randomChoosedNumbers.map(rand => {
        if (rand.number === appear.number) rand.weight += appear.count;
      });
    });
  }
  //  --- ${quantity} 回抽選する ---
  const result: PredictResultParams[] = [];
  for (let i = 0; i < quantity; i += 1) {
    const res: PredictResultParams = {
      result: [],
      pick_method: pickMethod,
      similar_pick: Object({}) // 抽選後に設定
    };
    // --- 1回抽選する ---
    const predictNumbers = predict(necessaryNumbers, randomChoosedNumbers, reverse!);
    for (const predictNum of predictNumbers) {
      // ${terms}期間中の出現頻度
      const frequency = getAllNumberAppearence(useLoto7Data, true);
      // 最後に選ばれた抽選回
      const lastPicked = getAppearance(loto7Data, predictNum.number, true)[0];
      // 各数字のデータを返す
      res.result.push({
        number: predictNum.number,
        amount: predictNum.weight - 1, // 元から1がセットしてあるので、その分を引く
        frequency: frequency.filter(item => item.number === predictNum.number)[0].volume,
        last_picked: {
          id: lastPicked.implemention,
          date: lastPicked.date
        }
      });
    }
    const similarPick = hasSameNumber(
      predictNumbers.map(item => item.number), loto7Data);
    for (let i = predictNumbers.length; i >= 0; i--) {
      // 被りが大きい順で見る
      if (similarPick[i] !== undefined) {
        res.similar_pick = {
          count_same_number: i,
          has_same_number: similarPick[i].map(item => {
            return {
              date: item.date,
              id: item.id,
              numbers: item.numbers
            } as PredictHasSameNumbersParams
          })
        };
        break;
      }
    }
    // 1回の抽選分のデータを返す
    result.push(res);
  }
  const validateResponse = PredictPostResponseParamsValidator.safeParse(result);
  if (!validateResponse.success) {
    res.status(400).json({
      status: 'NG',
      error_message: validateResponse.error.message,
      result: result
    });
    return;
  }
  // 結果を返す
  res.status(200).json({
    status: 'OK',
    error_message: null,
    result: result
  });
  return;
}

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


