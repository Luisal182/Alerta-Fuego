import { z } from 'zod';

// Risk levels
export type RiskLevel = 'low' | 'medium' | 'high';
// Status types
export type IncidentStatus = 'pending' | 'in_progress' | 'resolved';

// Assistance types
export type AssistanceType = 'police' | 'firefighter' | 'medical' | 'helicopter' | 'rescue';

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

// Incident data type
export interface Incident {
  id: string;
  latitude: number;
  longitude: number;
  description: string;
  risk_level: RiskLevel;
  timestamp: string;
  created_at: string;
  updated_at: string;
  status: IncidentStatus;
  assistance_type?: AssistanceType | null;
  dispatched_resources?: string[] | null;
}