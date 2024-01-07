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
    // 出現した数の最大 1/2 +5(マージン) をラベル付けしない
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
  const mostCountArray: number[] = [];
  const lessCountArray: number[] = [];
  const labeling = () => ((MAX_LOTO7_NUMBER - totalChange) > maxLeave);
  while (labeling()) {
    // mostを検索
    // カウント順に降順ソート
    result.sort((a, b) => (a.count < b.count) ? 1 : -1);
    if (result[mostIndex].volume !== undefined) break;
    maxCount = result[mostIndex].count;
    while (mostIndex < result.length && result[mostIndex].count >= maxCount) {
      console.log(`${totalChange}[most] num:${result[mostIndex].number}, count:${result[mostIndex].count} (maxCount: ${maxCount}, mostIndex: ${mostIndex})`);
      result[mostIndex].volume = 'most';
      // 未push
      if (mostCountArray.indexOf(result[mostIndex].count) === -1) {
        mostCountArray.unshift(result[mostIndex].count);
      }
      mostIndex += 1;
      totalChange += 1
    }
    if (!labeling()) break;
    // lessを検索
    // カウント順に昇順ソート
    result.sort((a, b) => (a.count > b.count) ? 1 : -1);
    if (result[lessIndex].volume !== undefined) break;
    minCount = result[lessIndex].count;
    while (lessIndex < result.length && minCount >= result[lessIndex].count) {
      console.log(`${totalChange}[less] num:${result[lessIndex].number}, count:${result[lessIndex].count} (minCount: ${minCount}, lessIndex: ${lessIndex})`);
      result[lessIndex].volume = 'less';
      // 未push
      if (lessCountArray.indexOf(result[lessIndex].count) === -1) {
        lessCountArray.unshift(result[lessIndex].count);
      }
      lessIndex += 1;
      totalChange += 1
    }
  }
  console.log(mostCountArray);
  console.log(lessCountArray);
  // most/less に分類されたものが2種類以上あるとき、
  // その半分を many/few に分類し直す
  if (mostCountArray.length > 0) {
    for (let i = 0; i < mostCountArray.length / 2; i += 1) {
      result.map(item => {
        if (item.count === mostCountArray[i]) {
          item.volume = 'many';
          console.log(`change[${mostCountArray[i]}]: number:${item.number}, count:${item.count} -> many`);
        }
      })
    }
  }
  if (lessCountArray.length > 0) {
    for (let i = 0; i < lessCountArray.length / 2; i += 1) {
      result.map(item => {
        if (item.count === lessCountArray[i]) {
          item.volume = 'few';
          console.log(`change[${lessCountArray[i]}]: number:${item.number}, count:${item.count} -> few`);
        }
      })
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
