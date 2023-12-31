
import fs from 'fs';
import { LOTO7 } from '@/types/loto';
import { LOTO7_FILENAME } from '../../crawler/constants';

export function getSavedLoto7DataSync() {
  const fileContent = fs.readFileSync(LOTO7_FILENAME).toString();
  return JSON.parse(fileContent) as LOTO7[];
}
