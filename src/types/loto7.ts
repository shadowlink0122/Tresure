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
export const LOTO7Validator = z.object({
  id: z.string().min(4).max(4), // 0001 ~
  date: z.date(),
  mainNumber: z.array(Loto7NumberValidator).length(7),
  bonusNumber: z.array(Loto7NumberValidator).length(2),
});

type LOTO7 = z.infer<typeof LOTO7Validator>;

export type {
  LOTO7,
}
