-- One-time transform from raw → canonical
-- Run this after importing CSV data to providers_raw

-- First, clear existing data to avoid duplicates (optional - comment out if you want to append)
TRUNCATE public.providers CASCADE;
TRUNCATE public.cities CASCADE;

-- 1) Distinct cities with collision-aware slugs
with dc as (
  select
    lower(trim(city))  as city_l,
    upper(trim(state)) as state_u,
    avg(latitude)      as lat,
    avg(longitude)     as lng,
    slugify(city)      as city_slug,
    lower(trim(state)) as state_slug
  from public.providers_raw
  where city is not null and state is not null
  group by 1,2,5,6
),
counts as (
  select city_slug, count(*) as c from dc group by 1
)
insert into public.cities (city, state, city_slug, state_slug, slug, lat, lng)
select
  initcap(city_l) as city,
  state_u         as state,
  city_slug,
  state_slug,
  case when counts.c > 1 then city_slug || '-' || state_slug else city_slug end as slug,
  lat, lng
from dc
join counts using (city_slug)
on conflict (slug) do nothing;

-- 2) Insert providers joined to their city slug
-- The trigger will automatically generate unique provider_slugs
-- Filter out records with null full_address to avoid constraint violations
insert into public.providers (
  name, website, phone, full_address, street, city, state, zip,
  lat, lng, review_count, rating, working_hours, source_url, city_slug
)
select
  pr.name,
  pr.site,
  pr.phone_number,
  pr.full_address,
  pr.street,
  initcap(pr.city),
  upper(pr.state),
  pr.postal_code,
  pr.latitude,
  pr.longitude,
  pr.review_count,
  pr.review_stars,
  pr.working_hours,
  pr.source_url,
  c.slug as city_slug
from public.providers_raw pr
join public.cities c
  on slugify(pr.city) = c.city_slug
 and lower(pr.state)  = c.state_slug
where pr.full_address is not null  -- Skip records with null full_address
  and pr.name is not null          -- Also ensure name is not null
on conflict (provider_slug) do nothing;  -- Skip if slug already exists (shouldn't happen with new trigger)