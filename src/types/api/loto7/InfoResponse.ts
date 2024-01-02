import z from 'zod';
import { Loto7Validator } from '@/types/loto7';
import { TresureResponseBase } from '../tresure_response_base';

export interface InfoResponse extends TresureResponseBase {
    result: z.infer<typeof Loto7Validator.array>;();
}
