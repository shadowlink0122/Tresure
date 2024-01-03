import { LOTO7 } from "../../types/loto7";

export function getAppearance(loto7: LOTO7[], checkNum: number, isMainNumber: boolean) {
  if (isMainNumber) {
    return loto7.filter(item => item.mainNumber.includes(checkNum));
  }
  return loto7.filter(item => item.bonusNumber.includes(checkNum));
}
