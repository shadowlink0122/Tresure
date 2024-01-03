import { NumberCountParams } from "@/types/api/search/loto7/all_number_appearence";
import { LOTO7, MAX_LOTO7_NUMBER } from "@/types/loto7";

function addVolume(result: NumberCountParams[], isMainNumber: boolean) {
  // ラベル付けしないデータ個数の最大値を決める
  let maxLeave = 0;
  if (result.length === MAX_LOTO7_NUMBER) {
    // 補充が存在しない場合、データは十分にあるので 
    // 全体の最大 1/3 をラベル付けしない
    maxLeave = MAX_LOTO7_NUMBER / 3
  } else {
    // 補充が存在する場合、データは十分にないので
    // 出現した数の最大 1/2 をラベル付けしない
    maxLeave = MAX_LOTO7_NUMBER / 2;
  }


  // 足りない分のデータ(count: 0)を補充
  for (let i = 1; i <= MAX_LOTO7_NUMBER; i += 1) {
    const found = result.filter(item => item.number === i);
    if (found.length === 0) {
      result.push({
        number: i,
        count: 0
      });
    }
  }

  // 最低限 'most' | 'less' をつける
  let mostIndex = 0;
  let lessIndex = 0;
  let maxCount = 0;
  let minCount = 0;
  let totalChange = 0;
  while (!((result.length - totalChange) <= maxLeave)) {
    // mostを検索
    // カウント順に降順ソート
    result.sort((a, b) => (a.count < b.count) ? 1 : -1);
    if (result[mostIndex].volume !== undefined) break;
    maxCount = result[mostIndex].count;
    while (mostIndex < result.length && result[mostIndex].count >= maxCount) {
      result[mostIndex].volume = 'most';
      mostIndex += 1;
      totalChange += 1
    }
    // lessを検索
    // カウント順に昇順ソート
    result.sort((a, b) => (a.count > b.count) ? 1 : -1);
    if (result[lessIndex].volume !== undefined) break;
    minCount = result[lessIndex].count;
    while (lessIndex < result.length && minCount >= result[lessIndex].count) {
      result[lessIndex].volume = 'less';
      lessIndex += 1;
      totalChange += 1
    }

    // ここから下はラベル付けしなくて良い値
    // 基準を超えていれば break
    if ((result.length - totalChange) <= maxLeave) break;
    // manyを検索
    // カウント順に降順ソート
    result.sort((a, b) => (a.count < b.count) ? 1 : -1);
    if (result[mostIndex].volume !== undefined) break;
    maxCount = result[mostIndex].count;
    while (mostIndex < result.length && result[mostIndex].count >= maxCount) {
      result[mostIndex].volume = 'many';
      mostIndex += 1;
      totalChange += 1
    }
    // fewを検索
    // カウント順に昇順ソート
    result.sort((a, b) => (a.count > b.count) ? 1 : -1);
    if (result[lessIndex].volume !== undefined) break;
    minCount = result[lessIndex].count;
    while (lessIndex < result.length && minCount >= result[lessIndex].count) {
      result[lessIndex].volume = 'few';
      lessIndex += 1;
      totalChange += 1
    }
  }
}

export function getAllNumberAppearence(loto7: LOTO7[], isMainNumber: boolean) {
  const result: NumberCountParams[] = [];
  // インデックス順に並び替える
  result.sort((a, b) => a.number < b.number ? 1 : -1);
  // 検索
  for (const item of loto7) {
    let targetNum = item.mainNumber;
    // 指定があればボーナス番号を調べる
    if (!isMainNumber) targetNum = item.bonusNumber;
    targetNum.map((i) => {
      let notFound = true;
      for (const res of result) {
        // 対象を見つけた
        if (res.number === i) {
          res.count += 1;
          notFound = false;
          break;
        }
      }
      // 対象を見つけれなかった(未push)
      if (notFound) {
        result.push({
          number: i,
          count: 1,
        });
      }
    });
  }

  addVolume(result, isMainNumber);

  // 番号順に昇順ソート
  result.sort((a, b) => (a.number > b.number) ? 1 : -1);
  return result;
}
