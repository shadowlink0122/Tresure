
import fs from 'fs';
import { LOTO7, Loto7Validator } from '@/types/loto7';
import { LOTO7_FILENAME } from '../../crawler/constants';

export function getSavedLoto7DataSync() {
  try {
    const fileContent = fs.readFileSync(LOTO7_FILENAME).toString();
    return JSON.parse(fileContent).map(Loto7Validator.parse)
  } catch (e) {
    console.error(e);
  }
  return null;
}
