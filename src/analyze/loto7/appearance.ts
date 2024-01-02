import { getSavedLoto7DataSync } from "../../db/file";
import { LOTO7, MAX_LOTO7_NUMBER } from "../../types/loto7";
import { BASE_DIR } from "../../../crawler/constants";
import { join } from "path";
import fs from 'fs';

function appearance(loto7: LOTO7[], checkNum: number) {
  return loto7.filter(item => item.mainNumber.includes(checkNum));
}

function main() {
  const fileContent = getSavedLoto7DataSync();
  for (let i = 1; i <= MAX_LOTO7_NUMBER; i += 1) {
    const result = appearance(fileContent, i);
    const dir = join(BASE_DIR, 'appearence');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      join(dir, `${i}.json`),
      JSON.stringify(result, null, 2));
  }
}

main();

