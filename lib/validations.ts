import { z } from 'zod'

// US state abbreviations (used in multiple schemas)
const US_STATES = [
  'al', 'ak', 'az', 'ar', 'ca', 'co', 'ct', 'de', 'fl', 'ga',
  'hi', 'id', 'il', 'in', 'ia', 'ks', 'ky', 'la', 'me', 'md',
  'ma', 'mi', 'mn', 'ms', 'mo', 'mt', 'ne', 'nv', 'nh', 'nj',
  'nm', 'ny', 'nc', 'nd', 'oh', 'ok', 'or', 'pa', 'ri', 'sc',
  'sd', 'tn', 'tx', 'ut', 'vt', 'va', 'wa', 'wv', 'wi', 'wy', 'dc'
] as const

// Search validation schemas
export const zipSearchSchema = z.object({
  zip: z.string().regex(/^\d{5}$/, 'ZIP code must be exactly 5 digits'),
  radius: z.coerce.number().min(1).max(100).default(50),
})

export const locationSearchSchema = z.object({
  location: z.string()
    .min(1, 'Location is required')
    .max(100, 'Location must be less than 100 characters')
    .trim()
    .transform(val => val.toLowerCase()),
})

// URL parameter validation schemas
export const stateParamsSchema = z.object({
  state: z.enum(US_STATES).refine(
    (val) => US_STATES.includes(val as any), 
    { message: 'Invalid state code' }
  ),
})

export const cityParamsSchema = z.object({
  state: z.enum(US_STATES),
  city: z.string()
    .min(1, 'City slug is required')
    .max(100, 'City slug too long')
    .regex(/^[a-z0-9-]+$/, 'City slug must contain only lowercase letters, numbers, and hyphens'),
})

export const studioParamsSchema = z.object({
  state: z.enum(US_STATES),
  city: z.string()
    .min(1, 'City slug is required')
    .max(100, 'City slug too long')
    .regex(/^[a-z0-9-]+$/, 'Invalid city slug format'),
  studio: z.string()
    .min(1, 'Studio slug is required')
    .max(150, 'Studio slug too long')
    .regex(/^[a-z0-9-]+$/, 'Invalid studio slug format'),
})

// Search params validation schemas
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).max(1000).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).optional(),
})

export const sortSchema = z.object({
  sort: z.enum(['rating', 'reviews', 'name', 'distance']).default('rating'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

export const filtersSchema = z.object({
  priceRange: z.enum(['budget', 'moderate', 'premium']).optional(),
  classType: z.enum(['wheel', 'handbuilding', 'glazing', 'all']).default('all'),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced', 'all']).default('all'),
  timeOfDay: z.enum(['morning', 'afternoon', 'evening', 'weekend', 'all']).default('all'),
})

// Combined search results schema
export const searchResultsSchema = paginationSchema
  .merge(sortSchema)
  .merge(filtersSchema)
  .transform(data => ({
    ...data,
    offset: data.offset ?? (data.page - 1) * data.limit
  }))

// Studio data validation schemas
export const studioSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Studio name is required'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  
  // Location fields
  street: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().length(2, 'State must be 2 characters'),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format').optional(),
  
  // Contact fields
  phone: z.string()
    .regex(/^(\+?1-?)?(\([0-9]{3}\)|[0-9]{3})[-. ]?[0-9]{3}[-. ]?[0-9]{4}$/, 'Invalid phone number format')
    .optional(),
  website: z.string().url('Invalid website URL').optional(),
  email: z.string().email('Invalid email format').optional(),
  
  // Rating fields
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().min(0).optional(),
  
  // Coordinates
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  
  // Business info
  description: z.string().max(2000, 'Description too long').optional(),
  workingHours: z.string().optional(),
  priceRange: z.enum(['$', '$$', '$$$', '$$$$']).optional(),
  
  // Features
  wheelAccess: z.boolean().optional(),
  handbuildingClasses: z.boolean().optional(),
  glazingServices: z.boolean().optional(),
  beginnerFriendly: z.boolean().optional(),
  wheelchairAccessible: z.boolean().optional(),
  parkingAvailable: z.boolean().optional(),
})

// Form validation schemas
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string()
    .regex(/^(\+?1-?)?(\([0-9]{3}\)|[0-9]{3})[-. ]?[0-9]{3}[-. ]?[0-9]{4}$/, 'Invalid phone number')
    .optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200, 'Subject too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message too long'),
  studioId: z.string().optional(),
})

export const reviewSchema = z.object({
  studioId: z.string().min(1, 'Studio ID is required'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  title: z.string().min(5, 'Review title must be at least 5 characters').max(100, 'Title too long'),
  content: z.string().min(20, 'Review must be at least 20 characters').max(2000, 'Review too long'),
  authorName: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  authorEmail: z.string().email('Invalid email address'),
  visitDate: z.date().max(new Date(), 'Visit date cannot be in the future').optional(),
})

// API response validation schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  errors: z.array(z.string()).optional(),
})

export const paginatedResponseSchema = z.object({
  data: z.array(z.unknown()),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPrevPage: z.boolean(),
  }),
})

// Environment validation schema
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Supabase service role key is required'),
  NEXT_PUBLIC_SITE_URL: z.string().url('Invalid site URL').default('https://localpotteryclasses.com'),
})

// Helper functions for validation
export function validateParams<T>(
  schema: z.ZodSchema<T>, 
  data: unknown,
  context = 'parameters'
): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ')
      throw new Error(`Invalid ${context}: ${errorMessages}`)
    }
    throw error
  }
}

export function safeValidateParams<T>(
  schema: z.ZodSchema<T>, 
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ')
      return { success: false, error: errorMessages }
    }
    return { success: false, error: 'Validation failed' }
  }
}

// Type exports for use in other files
export type ZipSearchInput = z.infer<typeof zipSearchSchema>
export type LocationSearchInput = z.infer<typeof locationSearchSchema>
export type StateParams = z.infer<typeof stateParamsSchema>
export type CityParams = z.infer<typeof cityParamsSchema>
export type StudioParams = z.infer<typeof studioParamsSchema>
export type PaginationInput = z.infer<typeof paginationSchema>
export type SortInput = z.infer<typeof sortSchema>
export type FiltersInput = z.infer<typeof filtersSchema>
export type SearchResultsInput = z.infer<typeof searchResultsSchema>
export type Studio = z.infer<typeof studioSchema>
export type ContactFormInput = z.infer<typeof contactFormSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type ApiResponse = z.infer<typeof apiResponseSchema>
export type PaginatedResponse = z.infer<typeof paginatedResponseSchema>
export type EnvConfig = z.infer<typeof envSchema>