import { LOTO7 } from "@/types/loto7";

export type HasSameValue = {
  id: string,
  date: string,
  numbers: number[],
  sameValue: number[]
};

export type HasSameValueDict = {
  [key: number]: HasSameValue[]
}

export function checkSameValue(a: number[], b: LOTO7) {
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


export function hasSameNumber(target: number[], loto7: LOTO7[]) {
  const result: HasSameValueDict = {}
  for (const loto of loto7) {
    const set = new Set([...target, ...loto.mainNumber]);
    const lengthDiff = target.length + loto.mainNumber.length - set.size;
    if (result[lengthDiff] !== undefined) {
      result[lengthDiff].push({
        id: loto.implemention,
        date: loto.date,
        numbers: loto.mainNumber,
        sameValue: checkSameValue(target, loto)
      });
    }
    else {
      result[lengthDiff] = [{
        id: loto.implemention,
        date: loto.date,
        numbers: loto.mainNumber,
        sameValue: checkSameValue(target, loto)
      }]
    }
  }
  return result;
}
