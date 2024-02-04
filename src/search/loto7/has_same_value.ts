import { join } from 'path';
import { getSavedLoto7DataSync } from '../../db/file';
import { LOTO7 } from '../../types/loto7';
import { Loto7Occur, Loto7OccurDict } from '../../types/loto7/occurrence';
import fs from 'fs';

export type hasSameValue = {
  implement: string[],
  sameValue: number[]
};

export type HasSameValueDict = {
  [key: number]: hasSameValue[]
}

export function getSameValue(a: number[], b: LOTO7) {
  const result: number[] = [];
  for (let i = 0; i < a.length; i += 1) {
    for (let j = 0; j < b.mainNumber.length; j += 1) {
      if (a[i] === b.mainNumber[j]) {
        result.push(a[i]);
        break;
      }
    }
  }
  return result;
}

export function hasSameValue(target: number[], loto7: LOTO7[]) {
  const result: HasSameValueDict = {}
  for (let i = 0; i < target.length; i += 1) {
    for (let j = i + 1; j < loto7.length; j += 1) {
      const set = new Set([...target, ...loto7[j].mainNumber]);
      const lengthDiff = target.length + loto7[j].mainNumber.length - set.size;
      if (result[lengthDiff] !== undefined) {
        result[lengthDiff].push({
          implement: [loto7[i].implemention, loto7[j].implemention],
          sameValue: getSameValue(target, loto7[j])
        });
      }
      else {
        result[lengthDiff] = [{
          implement: [loto7[i].implemention, loto7[j].implemention],
          sameValue: getSameValue(target, loto7[j])
        }]
      }
    }
  }
  const dir = join('result', 'has_same_number');
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true });
  fs.mkdirSync(dir, { recursive: true });
  for (let i = 1; i <= 7; i += 1) {
    const res = result[i];
    if (res === undefined) continue;
    fs.writeFileSync(join(dir, `${i}.json`), JSON.stringify(res, null, 2));
  }
  return result;
}

async function main() {
  const loto7Data = getSavedLoto7DataSync()!;
  hasSameValue([1, 2, 3, 4], loto7Data.slice(0, 10));
}

main();
