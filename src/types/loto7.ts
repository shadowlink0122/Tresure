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
export const Loto7ImplementionValidator = z.string().min(3);
export const Loto7DateValidator = z.string(); // TODO: Date型(yyyy/mm/dd)に変換する
export const Loto7NumberValidator = PositiveIntNumberValidator.min(1).max(MAX_LOTO7_NUMBER);
export const Loto7MainNumbersValidator = z.array(Loto7NumberValidator).length(7);
export const Loto7BonusNumbersValidator = z.array(Loto7NumberValidator).length(2);
export const Loto7Validator = z.object({
  implemention: Loto7ImplementionValidator,
  date: Loto7DateValidator,
  mainNumber: Loto7MainNumbersValidator,
  bonusNumber: Loto7BonusNumbersValidator,
});

export type LOTO7 = z.infer<typeof Loto7Validator>;
