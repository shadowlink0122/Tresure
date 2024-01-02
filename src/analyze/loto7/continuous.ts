import { getSavedLoto7DataSync } from "../../db/file";
import { LOTO7 } from "../../types/loto7";
import { BASE_DIR } from "../../../crawler/constants";
import { join } from "path";
import fs from 'fs';
import { Loto7ContinuousNumber } from "../../types/analyze/loto7/continuous";

export function continuous(loto7: LOTO7[]) {
  let mainContinuous = [0, 0, 0, 0, 0, 0, 0, 0];
  let bonusContinuous = [0, 0, 0];
  const result: Loto7ContinuousNumber[] = [];
  for (let i = 0; i < loto7.length - 1; i += 1) {
    const res: Loto7ContinuousNumber = Object({});
    const preLoto = loto7[i];
    const nextLoto = loto7[i + 1];
    // 実施回
    res.implement = [preLoto.implemention];
    res.implement.push(nextLoto.implemention);
    // 本番号
    res.sameMainNumber = preLoto.mainNumber.filter(item => nextLoto.mainNumber.includes(item));
    // ボーナス番号
    res.sameBonusNumber = preLoto.bonusNumber.filter(item => nextLoto.bonusNumber.includes(item));
    // 結果を保存
    result.push(res);
    mainContinuous[res.sameMainNumber.length] += 1;
    bonusContinuous[res.sameBonusNumber.length] += 1;
  }
  console.log('連続で同じ数が出た数');
  console.log(`本番号: ${mainContinuous}`);
  console.log(`ボーナス番号: ${bonusContinuous}`);

  return result;
}

export function checkContinueNumber(loto7: Loto7ContinuousNumber[], cntnNumber: number, only: boolean) {
  let result;
  if (only) {
    result = loto7.filter(item => item.sameMainNumber.length === cntnNumber);
    // console.log(`${cntnNumber}つの数が次の抽選に出たとき`);
    // console.log(result);
  }

  result = loto7.filter(item => item.sameMainNumber.length >= cntnNumber);
  // console.log(`少なくとも${cntnNumber}つの数が次の抽選に出たとき`);
  // console.log(result);

  return result;
}

function main() {
  const fileContent = getSavedLoto7DataSync();
  const result = continuous(fileContent);
  const continuousDir = join(BASE_DIR, 'continuous');

  // 結果を保存
  fs.mkdirSync(continuousDir, { recursive: true });
  fs.writeFileSync(join(continuousDir, 'result.json'), JSON.stringify(result, null, 2));
  for (let i = 0; i <= 7; i += 1) {
    const checkResult = checkContinueNumber(result, i, true);
    fs.writeFileSync(join(continuousDir, `${i}.json`), JSON.stringify(checkResult, null, 2));
  }
}

main();

