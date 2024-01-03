import z from 'zod';
import { PositiveIntNumberValidator } from './common';

// Numbers
const NUMBERSNumber = PositiveIntNumberValidator.min(0).max(9);
const NUMBERS4Validator = NUMBERSNumber.array().length(4);
type NUMBERS4 = z.infer<typeof NUMBERS4Validator>;

export type {
  NUMBERS4
}

// ロト7
export const MAX_LOTO7_NUMBER = 37;
export const Loto7NumberValidator = PositiveIntNumberValidator.min(1).max(MAX_LOTO7_NUMBER);
export const Loto7Validator = z.object({
  id: z.string().min(4).max(4), // 0001 ~
  date: z.coerce.date(),
  mainNumber: z.array(Loto7NumberValidator).length(7),
  bonusNumber: z.array(Loto7NumberValidator).length(2),
})

export type LOTO7 = z.infer<typeof Loto7Validator>;
