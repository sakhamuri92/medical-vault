import { z } from 'zod';

export const memberSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  dob: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  bloodGroup: z.string().optional(),
  relationship: z.string().optional(),
  countryCode: z.string().length(2).optional(),
  heightCm: z.number().positive().optional(),
  weightKg: z.number().positive().optional(),
  allergies: z.array(z.string()).optional(),
  conditions: z.array(z.string()).optional(),
  emergencyContact: z.string().optional(),
  isDeceased: z.boolean().optional(),
});

export const documentSchema = z.object({
  memberId: z.string().min(1),
  type: z.enum([
    'prescription',
    'lab',
    'xray',
    'bill',
    'vaccine',
    'discharge',
    'insurance',
    'other',
  ]),
  title: z.string().optional(),
  doctorName: z.string().optional(),
  hospitalName: z.string().optional(),
  documentDate: z.string().optional(),
  countryCode: z.string().length(2).optional(),
  currencyCode: z.string().length(3).optional(),
  notes: z.string().optional(),
  amount: z.number().nonnegative().optional(),
});

export type MemberFormValues = z.infer<typeof memberSchema>;
export type DocumentFormValues = z.infer<typeof documentSchema>;
