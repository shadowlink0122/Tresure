import { getSavedLoto7DataSync } from "../../db/file";
import { LOTO7 } from "@/types/loto";
import { BASE_DIR } from "../../../crawler/constants";
import { join } from "path";
import fs from 'fs';

const filename = join(BASE_DIR, 'continuous.json');

type Continuous = {
  implement: string[],
  sameMainNumber: number[],
  sameBonusNumber: number[],
};

function continuous(loto7: LOTO7[]) {
  let mainContinuous = [0, 0, 0, 0, 0, 0, 0, 0];
  let bonusContinuous = [0, 0, 0];
  const result: Continuous[] = [];
  for (let i = 0; i < loto7.length - 1; i += 1) {
    const res: Continuous = Object({});
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

function checkContinueNumber(loto7: Continuous[], cntnNumber: number, only: boolean) {
  if (only) {
    const result = loto7.filter(item => item.sameMainNumber.length === cntnNumber);
    console.log(`${cntnNumber}つの数が次の抽選に出たとき`);
    console.log(result);
  }

  const result = loto7.filter(item => item.sameMainNumber.length >= cntnNumber);
  console.log(`少なくとも${cntnNumber}つの数が次の抽選に出たとき`);
  console.log(result);

  return result;
}

function main() {
  const checkNum = 2;
  const fileContent = getSavedLoto7DataSync();
  const result = continuous(fileContent);
  const checkResult = checkContinueNumber(result, checkNum, false);
  fs.writeFileSync(filename, JSON.stringify(result, null, 2));
  fs.writeFileSync(join(BASE_DIR, `checkContinue_${checkNum}.json`), JSON.stringify(checkResult, null, 2));
}


main();

