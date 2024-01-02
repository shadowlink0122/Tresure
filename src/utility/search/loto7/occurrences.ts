import { getSavedLoto7DataSync } from '../../../db/file';
import { LOTO7 } from '../../../types/loto7';
import { Loto7Occur, Loto7OccurDict } from '../../../types/loto7/occurrence';

export function mainNumberOccurrences(loto7: LOTO7[]) {
  const occurDict: Loto7OccurDict = {};
  const occurResult: Loto7Occur[] = [];
  for (let i = 0; i < loto7.length; i += 1) {
    // キーが存在するか確認
    for (let j = 0; j < loto7[i].mainNumber.length; j += 1) {
      if (occurDict[loto7[i].mainNumber[j]] === undefined) {
        // 存在しない場合、1をセットする
        occurDict[loto7[i].mainNumber[j]] = 1;
      } else {
        // 存在する場合、加算する
        occurDict[loto7[i].mainNumber[j]]++;
      }
    }
  }

  const keys = Object.keys(occurDict);
  for (const key of keys) {
    occurResult.push({
      mainNumber: Number(key),
      count: occurDict[Number(key)]
    });
  }

  occurResult.sort((a: Loto7Occur, b: Loto7Occur) => {
    if (a.count > b.count) return -1;
    else if (a.count < b.count) return 1;
    return 0;
  });

  for (const res of occurResult) {
    const ratio = res.count / loto7.length;
    console.log(`${res.mainNumber}: ${res.count} (${ratio} %)`);
  }

  return [occurDict, occurResult]
}

async function main() {
  const loto7Data = getSavedLoto7DataSync()!;
  mainNumberOccurrences(loto7Data);
}

main();
