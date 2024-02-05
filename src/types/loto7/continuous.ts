import z from 'zod';
import { Loto7NumberValidator } from '../loto7';

// 引き継がれる番号を探す
const Loto7ContinuousNumberValidator = z.object({
  implement: z.array(z.string()),
  sameMainNumber: z.array(Loto7NumberValidator).max(7),
  sameBonusNumber: z.array(Loto7NumberValidator).max(2),
});
type Loto7ContinuousNumber = z.infer<typeof Loto7ContinuousNumberValidator>;

export type { Loto7ContinuousNumber };
