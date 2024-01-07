import z from 'zod';
import { PositiveIntNumberValidator } from './common';

// Numbers
const NUMBERSNumber = PositiveIntNumberValidator.min(0).max(9);
const NUMBERS4Validator = NUMBERSNumber.array().length(4);
type NUMBERS4 = z.infer<typeof NUMBERS4Validator>;

export type {
  NUMBERS4
}

// 他のロト
export const MAX_MINILOTO_NUMBER = 31;
export const MAX_LOTO6_NUMBER = 43;
export const MiniLotoNumberValidator = PositiveIntNumberValidator.min(1).max(MAX_MINILOTO_NUMBER);
export const Loto6NumberValidator = PositiveIntNumberValidator.min(1).max(MAX_LOTO6_NUMBER);

export type MiniLOTO = z.infer<typeof MINILOTOValidator>;
export type LOTO6 = z.infer<typeof LOTO6Validator>;

export const MINILOTOValidator = z.object({
  implemention: z.string().min(3),
  mainNumber: z.array(MiniLotoNumberValidator).length(5),
  bonusNumber: z.array(MiniLotoNumberValidator).length(1),
});
export const LOTO6Validator = z.object({
  implemention: z.string().min(3),
  mainNumber: z.array(Loto6NumberValidator).length(6),
  bonusNumber: z.array(Loto6NumberValidator).length(2),
});