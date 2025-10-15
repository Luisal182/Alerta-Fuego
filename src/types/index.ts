import { z } from 'zod';

// Risk levels
export type RiskLevel = 'low' | 'medium' | 'high';

// Report form schema
export const reportFormSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  riskLevel: z.enum(['low', 'medium', 'high']),
});

// Type inference from schema
export type ReportFormData = z.infer<typeof reportFormSchema>;