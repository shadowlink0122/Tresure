import { LOTO7 } from "../../../types/loto7";
import { SearchInheritanceParams } from "@/types/api/search/loto7/inheritance";
import { SearchInheritanceCondition } from "@/types/api/search/loto7/inheritance";

function getAllInheritanceList(loto7: LOTO7[]) {
  const result: SearchInheritanceParams[] = [];
  for (let i = 0; i < loto7.length - 1; i += 1) {
    const res: SearchInheritanceParams = Object({});
    const preLoto = loto7[i];
    const nextLoto = loto7[i + 1];
    // 実施回
    res.implemention = [
      preLoto.implemention,
      nextLoto.implemention
    ];
    // 本番号
    res.sameMainNumber = preLoto.mainNumber.filter(item => nextLoto.mainNumber.includes(item));
    // ボーナス番号
    res.sameBonusNumber = preLoto.bonusNumber.filter(item => nextLoto.bonusNumber.includes(item));
    // 結果を保存
    result.push(res);
  }
  return result;
}

export function getInheritanceList(loto7: LOTO7[], inherit_count: number, condition: SearchInheritanceCondition, is_main_number: boolean) {
  const searchResult: SearchInheritanceParams[] = getAllInheritanceList(loto7);
  if (is_main_number) {
    switch (condition) {
      case 'over':
        return searchResult.filter(item => item.sameMainNumber.length > inherit_count);
      case 'more':
        return searchResult.filter(item => item.sameMainNumber.length >= inherit_count);
      case 'equal':
        return searchResult.filter(item => item.sameMainNumber.length === inherit_count);
      case 'less':
        return searchResult.filter(item => item.sameMainNumber.length <= inherit_count);
      case 'under':
        return searchResult.filter(item => item.sameMainNumber.length < inherit_count);
      default:
        return null;
    }
  } else {
    switch (condition) {
      case 'over':
        return searchResult.filter(item => item.sameBonusNumber.length > inherit_count);
      case 'more':
        return searchResult.filter(item => item.sameBonusNumber.length >= inherit_count);
      case 'equal':
        return searchResult.filter(item => item.sameBonusNumber.length === inherit_count);
      case 'less':
        return searchResult.filter(item => item.sameBonusNumber.length <= inherit_count);
      case 'under':
        return searchResult.filter(item => item.sameBonusNumber.length < inherit_count);
      default:
        return null;
    }
  }
}
