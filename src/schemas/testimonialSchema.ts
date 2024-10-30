
import {z} from 'zod';

export const testimonialSchema = z.object({
    occupation: z.string().min(2,{message:'Occupation should be at least 2 characters'}).max(50,{message:'Occupation should be at most 50 characters'}),
    text: z.string().min(2,{message:'Feedback Text should be at least 2 characters'}).max(250,{message:'Feedback Text should be at most 250 characters'}),
    rating: z.number().min(1,{message:'Rating should be at least 1'}).max(5,{message:'Rating should be at most 5'}),
    canBePubliclyShown: z.boolean().optional()
})