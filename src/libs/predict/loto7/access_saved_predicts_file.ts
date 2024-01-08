import { BASE_DIR } from "@/constants";
import {
  PredictDispersionParams,
  PredictPostResponseParams,
  PredictResultParams
} from "@/types/api/predict/loto7";
import { join } from "path";
import fs from 'fs';

export const PREDICT_DIR = join(BASE_DIR, 'predict');
export type SavedPredictType = {
  dispersion: PredictDispersionParams,
  predict: PredictPostResponseParams
};

export function getPredictFileSync(implement: number) {
  try {
    const fileContent = fs.readFileSync(
      join(PREDICT_DIR, `${implement}.json`)
    );

    return JSON.parse(fileContent.toString()) as SavedPredictType[];
  } catch (e) {
    console.log(e);
  }
  return null;
}

export function savePredictSync(dispersion: PredictDispersionParams, result: PredictResultParams[], implement: number) {
  Object.freeze(result);
  const nowAdding: SavedPredictType = {
    dispersion: { ...dispersion },
    predict: structuredClone(result)
  }
  // 関連情報は履歴に不要なので消す
  nowAdding.predict.map(item => item.similar_pick = Object());
  try {
    const isCreated = getPredictFileSync(implement);
    if (isCreated !== null) {
      // ファイルがあれば追記
      const fileContent = [...isCreated, nowAdding];
      fs.writeFileSync(
        join(PREDICT_DIR, `${implement}.json`),
        JSON.stringify(fileContent, null, 2)
      );
      return true;
    }
    // ファイルがなければ新規作成
    fs.mkdirSync(PREDICT_DIR, { recursive: true });
    fs.writeFileSync(
      join(PREDICT_DIR, `${implement}.json`),
      JSON.stringify([nowAdding], null, 2)
    );
    return true;
  } catch (e) {
    console.log(e);
  }
  return false;
}
