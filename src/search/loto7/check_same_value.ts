import { join } from 'path';
import { getSavedLoto7DataSync } from '../../db/file';
import { LOTO7 } from '../../types/loto7';
import { Loto7Occur, Loto7OccurDict } from '../../types/loto7/occurrence';
import fs from 'fs';

type hasSameValue = {
  implement: string[],
  sameValue: number[]
};

type HasSameValueDict = {
  [key: number]: hasSameValue[]
}

function getSameValue(a: LOTO7, myLoto: number[]) {
  const result: number[] = [];
  for (let i = 0; i < a.mainNumber.length; i += 1) {
    for (let j = 0; j < myLoto.length; j += 1) {
      if (a.mainNumber[i] === myLoto[j]) {
        result.push(a.mainNumber[i]);
        break;
      }
    }
  }
  return result;
}

function checkSameValue(loto7: LOTO7[], myLoto: number[]) {
  const result: HasSameValueDict = {}
  for (let i = 0; i < loto7.length; i += 1) {
    const set = new Set([...loto7[i].mainNumber, ...myLoto]);
    // console.log(`same[${loto7[i].mainNumber.length * 2 - set.size}] (${loto7[i].implemention}: ${loto7[i].mainNumber}) -> (${loto7[j].implemention}: ${loto7[j].mainNumber})`)
    if (result[loto7[i].mainNumber.length + myLoto.length - set.size] !== undefined) {
      result[loto7[i].mainNumber.length + myLoto.length - set.size].push({
        implement: [loto7[i].implemention],
        sameValue: getSameValue(loto7[i], myLoto)
      });
    }
    else {
      result[loto7[i].mainNumber.length + myLoto.length - set.size] = [{
        implement: [loto7[i].implemention],
        sameValue: getSameValue(loto7[i], myLoto)
      }]
    }
  }
  for (let i = 1; i <= 7; i += 1) {
    const res = result[i];
    if (res === undefined) continue;
    const dir = join('result', 'check_same_number');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(join(dir, `${i}.json`), JSON.stringify(res, null, 2));
  }
}

async function main() {
  const loto7Data = getSavedLoto7DataSync()!;
  const myLoto: number[] = [];
  checkSameValue(loto7Data, myLoto);
}

main();
