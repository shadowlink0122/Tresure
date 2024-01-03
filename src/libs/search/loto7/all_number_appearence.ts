import { NumberCountParams } from "@/types/api/search/loto7/all_number_appearence";
import { LOTO7, MAX_LOTO7_NUMBER } from "@/types/loto7";

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

  // 確認する回数(最大3)
  const check_volume_times = Math.max(
    1,
    Math.trunc(result.length / 15)
  );

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

  // カウント順に降順ソート
  result.sort((a, b) => (a.count < b.count) ? 1 : -1);
  // mostを検索
  let maxCount = 0;
  let nowIndex = 0;
  for (let i = 0; i < check_volume_times; i += 1) {
    maxCount = result[nowIndex].count;
    while (result[nowIndex].count >= maxCount) {
      result[nowIndex].volume = 'most';
      nowIndex += 1;
    }
  }
  // manyを検索
  for (let i = 0; i < check_volume_times; i += 1) {
    maxCount = result[nowIndex].count;
    while (result[nowIndex].count >= maxCount) {
      result[nowIndex].volume = 'many';
      nowIndex += 1;
    }
  }

  // カウント順に昇順ソート
  result.sort((a, b) => (a.count > b.count) ? 1 : -1);
  // lessを検索
  let minCount = 0;
  nowIndex = 0;
  for (let i = 0; i < check_volume_times; i += 1) {
    minCount = result[nowIndex].count;
    while (minCount >= result[nowIndex].count) {
      result[nowIndex].volume = 'less';
      nowIndex += 1;
    }
  }
  // fewを検索
  for (let i = 0; i < check_volume_times; i += 1) {
    minCount = result[nowIndex].count;
    while (minCount >= result[nowIndex].count) {
      result[nowIndex].volume = 'few';
      nowIndex += 1;
    }
  }

  // 番号順に昇順ソート
  result.sort((a, b) => (a.number > b.number) ? 1 : -1);
  return result;
}
