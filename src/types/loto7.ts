import z from 'zod';
import { PositiveNumberValidator } from './common';

// Numbers
const NUMBERSNumber = PositiveNumberValidator.min(0).max(9);
const NUMBERS4Validator = NUMBERSNumber.array().length(4);
type NUMBERS4 = z.infer<typeof NUMBERS4Validator>;

export type {
  NUMBERS4
}

// ロト7
export const MAX_LOTO7_NUMBER = 37;
export const Loto7NumberValidator = PositiveNumberValidator.min(1).max(MAX_LOTO7_NUMBER);
const LOTO7Validator = z.object({
  implemention: z.string().min(3),
  date: z.string(), // TODO: Date型(yyyy/mm/dd)に変換する
  mainNumber: z.array(Loto7NumberValidator).length(7),
  bonusNumber: z.array(Loto7NumberValidator).length(2),
});

type LOTO7 = z.infer<typeof LOTO7Validator>;

export type {
  LOTO7,
}
