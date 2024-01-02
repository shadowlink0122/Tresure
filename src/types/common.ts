import z from 'zod';

// 共通
export const PositiveNumberValidator = z.number().positive();
