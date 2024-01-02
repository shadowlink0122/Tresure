import z from 'zod';

// 共通
export const PositiveIntNumberValidator = z.number().int().positive();
