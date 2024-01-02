import z from 'zod';

// Numbers
const NUMBERSNumber = z.number().min(0).max(9);
const NUMBERS4Validator = NUMBERSNumber.array().length(4);
type NUMBERS4 = z.infer<typeof NUMBERS4Validator>;

export type {
  NUMBERS4
}

// ロト
export const MAX_MINILOTO_NUMBER = 31;
export const MAX_LOTO6_NUMBER = 43;
export const MAX_LOTO7_NUMBER = 37;
const MiniLotoNumber = z.number().min(1).max(MAX_MINILOTO_NUMBER);
const Loto6Number = z.number().min(1).max(MAX_LOTO6_NUMBER);
const Loto7Number = z.number().min(1).max(MAX_LOTO7_NUMBER);
const MINILOTOValidator = z.object({
  implemention: z.string().min(3),
  mainNumber: z.array(MiniLotoNumber).length(5),
  bonusNumber: z.array(MiniLotoNumber).length(1),
});
const LOTO6Validator = z.object({
  implemention: z.string().min(3),
  mainNumber: z.array(Loto6Number).length(6),
  bonusNumber: z.array(Loto6Number).length(2),
});
const LOTO7Validator = z.object({
  implemention: z.string().min(3),
  date: z.string(), // TODO: Date型(yyyy/mm/dd)に変換する
  mainNumber: z.array(Loto7Number).length(7),
  bonusNumber: z.array(Loto7Number).length(2),
});

type MiniLOTO = z.infer<typeof MINILOTOValidator>;
type LOTO6 = z.infer<typeof LOTO6Validator>;
type LOTO7 = z.infer<typeof LOTO7Validator>;

export type {
  MiniLOTO,
  LOTO6,
  LOTO7
}
