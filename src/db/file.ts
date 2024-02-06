import fs from 'fs';
import { LOTO7 } from '@/types/loto7';
import { LOTO7_FILENAME } from '../../crawler/constants';

export function getSavedLoto7DataSync() {
  try {
    const fileContent = fs.readFileSync(LOTO7_FILENAME).toString();
    return JSON.parse(fileContent) as LOTO7[];
  } catch (e) {
    console.error(e);
  }
  return null;
}
