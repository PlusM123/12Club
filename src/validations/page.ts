import { z } from 'zod'

export const pageSchema = z.object({
  selectedType: z.string().min(1).max(107),
  selectedLanguage: z.string().min(1).max(107),
  sortField: z.union([
    z.literal('created'),
    z.literal('updated'),
    z.literal('view'),
    z.literal('download'),
    z.literal('favorite')
  ]),
  sortOrder: z.union([z.literal('asc'), z.literal('desc')]),
  page: z.coerce.number().min(1).max(9999999),
  limit: z.coerce.number().min(1).max(24)
})
