import { z } from 'zod';

export const createIdeaSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters long.')
    .refine((value) => value.length > 0, 'Title is required.'),
  description: z
    .string()
    .trim()
    .max(500, 'Description must be at most 500 characters long.')
    .optional()
    .default(''),
});

export const createIdeaFormDataSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters long.')
    .refine((value) => value.length > 0, 'Title is required.'),
  description: z
    .string()
    .trim()
    .max(500, 'Description must be at most 500 characters long.')
    .optional()
    .default(''),
});

export const formatZodErrors = (error: z.ZodError) => {
  const issues = error.issues.map((issue) => ({
    field: issue.path[0] ?? 'body',
    message: issue.message,
  }));

  return {
    message: 'Validation failed',
    errors: issues,
  };
};
