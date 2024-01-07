import z from 'zod';
import { PositiveIntNumberValidator } from './common';

// ロト7
export const LOTO7_ARRAY_LENGTH = 7;
export const MAX_LOTO7_NUMBER = 37;
export const Loto7NumberValidator = PositiveIntNumberValidator.min(1).max(MAX_LOTO7_NUMBER);
export const Loto7Validator = z.object({
  implemention: z.string().min(3),
  date: z.string(), // TODO: Date型(yyyy/mm/dd)に変換する
  mainNumber: z.array(Loto7NumberValidator).length(7),
  bonusNumber: z.array(Loto7NumberValidator).length(2),
});

export type LOTO7 = z.infer<typeof Loto7Validator>;
