import z from 'zod';
import { Loto7NumberValidator } from '../loto7';
import { PositiveIntNumberValidator } from '@/types/common';

// 番号の出現回
export type Loto7OccurDict = {
  [key: z.infer<typeof Loto7NumberValidator>]: z.infer<typeof Loto7NumberValidator>,
};

export type Loto7Occur = {
  mainNumber: z.infer<typeof Loto7NumberValidator>,
  count: z.infer<typeof PositiveIntNumberValidator>,
};

// ペアで出やすい番号
export type Loto7Pair = {
  parent: z.infer<typeof Loto7NumberValidator>,
  count: z.infer<typeof PositiveIntNumberValidator>,
};

export type Loto7DepOccurDict = {
  [key: z.infer<typeof Loto7NumberValidator>]: Loto7Pair[]
};
