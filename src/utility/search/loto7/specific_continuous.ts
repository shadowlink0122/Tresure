// import { MAX_LOTO7_NUMBER } from "../../../types/loto7";
// import { getAllInheritanceList, getInheritanceList } from "./inheritance";
// import { getSavedLoto7DataSync } from "../../../db/file";
// import fs from 'fs';
// import { BASE_DIR } from "../../../../crawler/constants";
// import { join } from "path";
// import { Loto7ContinuousNumber } from "../../../types/loto7/continuous";

// function getSpecificContinuous(loto7: Loto7ContinuousNumber[], checkNum: number) {
//   return loto7.filter(item => item.sameMainNumber.includes(checkNum) || item.sameBonusNumber.includes(checkNum));
// }

// function main() {
//   const fileContent = getSavedLoto7DataSync()!;
//   const continuousNumber = getInheritanceList(fileContent, 1, 'more');
//   for (let i = 1; i < MAX_LOTO7_NUMBER; i += 1) {
//     const result = getSpecificContinuous(continuousNumber, i);
//     const dir = join(BASE_DIR, 'specific_continuous');
//     fs.mkdirSync(dir, { recursive: true });
//     fs.writeFileSync(
//       join(dir, `${i}.json`),
//       JSON.stringify(result, null, 2)
//     );
//   }
// }

// main();
