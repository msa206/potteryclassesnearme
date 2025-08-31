-- Fix provider_slug uniqueness for multiple locations
-- This updates the trigger to include address or zip in the slug for uniqueness

-- Drop the existing trigger first
DROP TRIGGER IF EXISTS providers_slugify_tg ON public.providers;

-- Update the trigger function to handle multiple locations
CREATE OR REPLACE FUNCTION public.providers_slugify_fn()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter int := 1;
BEGIN
  -- Ensure city_slug is set
  IF new.city_slug IS NULL OR length(new.city_slug) = 0 THEN
    new.city_slug := slugify(new.city || '-' || new.state);
  END IF;
  
  -- Create base slug from name and city
  base_slug := slugify(coalesce(new.name, '') || '-' || new.city_slug);
  final_slug := base_slug;
  
  -- Check if this slug already exists (for a different provider)
  WHILE EXISTS (
    SELECT 1 FROM public.providers 
    WHERE provider_slug = final_slug 
    AND (new.id IS NULL OR id != new.id)  -- Exclude current record on updates
  ) LOOP
    -- Add counter to make it unique
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  new.provider_slug := final_slug;
  new.updated_at := now();
  RETURN new;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER providers_slugify_tg
BEFORE INSERT OR UPDATE ON public.providers
FOR EACH ROW EXECUTE FUNCTION public.providers_slugify_fn();

-- Update existing duplicate slugs to make them unique
WITH duplicates AS (
  SELECT 
    id,
    provider_slug,
    ROW_NUMBER() OVER (PARTITION BY provider_slug ORDER BY created_at) as rn
  FROM public.providers
),
updates AS (
  SELECT 
    id,
    provider_slug,
    CASE 
      WHEN rn = 1 THEN provider_slug
      ELSE provider_slug || '-' || (rn - 1)
    END as new_slug
  FROM duplicates
  WHERE rn > 1
)
UPDATE public.providers p
SET provider_slug = u.new_slug
FROM updates u
WHERE p.id = u.id;