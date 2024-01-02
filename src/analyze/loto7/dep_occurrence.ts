import { getSavedLoto7DataSync } from "@/db/file";
import { Loto7DepOccurDict, Loto7Pair } from "@/types/analyze/loto7/occurrence";

const resultDict: Loto7DepOccurDict = {}

function setNumber(key: number, value: number) {
  if (resultDict[key] === undefined) {
    resultDict[key] = [{ parent: value, count: 1 }];
  } else {
    const pair = resultDict[key].find(elm => elm.parent === value);
    // 見つかった場合、カウントを増やす
    if (pair !== undefined) {
      pair.count += 1;
      return;
    }
    // 見つからなかった場合、1を入れる
    resultDict[key].push({
      parent: value,
      count: 1,
    });
  }
}

function createDepOccurDict() {
  const fileContent = getSavedLoto7DataSync().slice(530);
  // 数字を辞書に入れていく
  console.log('set pair number.');
  for (const loto7 of fileContent) {
    for (let i = 0; i < 7; i += 1) {
      for (let j = i + 1; j < 7; j += 1) {
        setNumber(loto7.mainNumber[i], loto7.mainNumber[j]);
        setNumber(loto7.mainNumber[j], loto7.mainNumber[i]);
      }
    }
  }
  console.log('sorting');
  // キーごとに関連する数字をソートする
  const dictKeys = Object.keys(resultDict);
  for (const key of dictKeys) {
    resultDict[Number(key)].sort((a: Loto7Pair, b: Loto7Pair) => {
      if (a.count > b.count) return -1;
      else if (a.count < b.count) return 1;
      else if (a.parent < b.parent) return 1;
      return 0;
    });
  }
  console.log("dep:");
  for (const dkey of dictKeys) {
    const key = Number(dkey);
    process.stdout.write(`${key}:`);
    for (let i = 0; i < Math.min(resultDict[key].length, 7); i += 1) {
      const pair = resultDict[key][i];
      process.stdout.write(` ${pair.parent}(${pair.count})`);
    }
    console.log('');
  }
}

function main() {
  createDepOccurDict();
}

main();
