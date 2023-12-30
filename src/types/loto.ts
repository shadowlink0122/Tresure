import z from 'zod';

// Numbers
const NUMBERSNumber = z.number().min(0).max(9);
const NUMBERS4Validator = NUMBERSNumber.array().length(4);
type NUMBERS4 = z.infer<typeof NUMBERS4Validator>;

export {
  NUMBERS4
}

// ロト
const MiniLotoNumber = z.number().min(1).max(31);
const Loto6Number = z.number().min(1).max(43);
const Loto7Number = z.number().min(1).max(37);
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
  mainNumber: z.array(Loto7Number).length(7),
  bonusNumber: z.array(Loto7Number).length(2),
});

type MiniLOTO = z.infer<typeof MINILOTOValidator>;
type LOTO6 = z.infer<typeof LOTO6Validator>;
type LOTO7 = z.infer<typeof LOTO7Validator>;

export {
  MiniLOTO,
  LOTO6,
  LOTO7
}
