import {z} from 'zod';

export const transformationSchema = z.object({
    title: z.string().min(2,{message:'Title should be at least 2 characters'}).max(50,{message:'Title should be at most 50 characters'}),
    sourceImgUrl: z.string(),
    backgroundImgUrl: z.string().optional(),
    transformedImgUrl: z.string(),
    aspectRatio:z.string().optional(),
})