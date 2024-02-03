import { LOTO7 } from "@/types/loto7";
import { PredictResultParams as WinningResult } from "@/types/api/predict/loto7/result";
import { PredictElementParams } from "@/types/api/predict/loto7";

export function getWinningData(winningNumber: LOTO7, predictNumber: PredictElementParams) {
  const result: WinningResult = {
    numbers: [],
    pick_method: predictNumber.pick_method
  };
  let mainNumberCount = 0;
  let bonusNumberCount = 0;

  // 当選した数を確認する
  predictNumber.result.map(item => {
    winningNumber.mainNumber.map(i => {
      if (item.number === i) {
        // 本番号の当選
        result.numbers.push({
          number: i,
          is_same: 'main'
        });
        mainNumberCount += 1;
      }
    });
    winningNumber.bonusNumber.map(i => {
      if (item.number === i) {
        // ボーナス番号の当選
        result.numbers.push({
          number: i,
          is_same: 'bonus'
        });
        bonusNumberCount += 1;
      }
    });
  });
  predictNumber.result.map(item => {
    let isContained = false;
    result.numbers.map(i => {
      if (item.number === i.number) isContained = true;
    })
    if (!isContained) {
      // 当選していない数字を入れる
      result.numbers.push({
        number: item.number,
      });
    }
  });

  // 当選結果
  if (mainNumberCount === 7) {
    // 1等: 本番号7桁が一致
    result.rank = 1;
  } else if (mainNumberCount === 6 && bonusNumberCount > 0) {
    // 2等: 本番号6桁 と ボーナス番号1桁が一致
    result.rank = 2;
  } else if (mainNumberCount === 6) {
    // 3等: 本番号6桁と一致
    result.rank = 3;
  } else if (mainNumberCount === 5) {
    // 4等: 本番号5桁と一致
    result.rank = 4;
  } else if (mainNumberCount === 4) {
    // 5等: 本番号4桁と一致
    result.rank = 5;
  } else if (mainNumberCount === 3 && bonusNumberCount > 0) {
    // 6等: 本番号3桁 と ボーナス番号1~2桁と一致
    result.rank = 6;
  }
  // else: それ以外はハズレ
  return result;
}