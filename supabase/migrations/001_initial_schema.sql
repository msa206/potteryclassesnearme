-- Enable required extensions
create extension if not exists pgcrypto; -- gen_random_uuid()
create extension if not exists unaccent;
create extension if not exists pg_trgm;

-- Slugify function
create or replace function public.slugify(txt text)
returns text language sql immutable as $$
  select regexp_replace(
           regexp_replace(lower(unaccent(coalesce(txt, ''))), '[^a-z0-9]+', '-', 'g'),
           '(^-|-$)', '', 'g'
         )
$$;

-- Raw import table (matches your current columns exactly)
create table if not exists public.providers_raw (
  name           text,
  site           text,
  phone_number   text,
  full_address   text,
  street         text,
  city           text,
  state          text,
  postal_code    text,
  review_count   int,
  review_stars   numeric(3,2),
  working_hours  text,
  latitude       double precision,
  longitude      double precision,
  source_url     text
);

-- Cities (globally-unique slug drives /pottery-classes/{slug})
create table if not exists public.cities (
  id           bigserial primary key,
  city         text not null,
  state        text not null,            -- 2-letter
  city_slug    text not null,            -- e.g. 'miami'
  state_slug   text not null,            -- e.g. 'fl'
  slug         text not null unique,     -- 'miami' or 'springfield-il'
  lat          double precision,
  lng          double precision,
  intro_mdx_path text
);

create index if not exists cities_city_state_idx on public.cities (lower(city), lower(state));
create index if not exists cities_slug_idx on public.cities (slug);

-- Providers (normalized for SEO pages)
create table if not exists public.providers (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  provider_slug  text not null unique,            -- 'mud-lab-miami' (uses city slug)
  website        text,
  phone          text,
  full_address   text not null,
  street         text not null,
  city           text not null,
  state          text not null,
  zip            text not null,                   -- from postal_code
  lat            double precision,
  lng            double precision,
  review_count   int,
  rating         numeric(3,2),                    -- from review_stars
  working_hours  text,                            -- keep as text for import; can switch to JSONB later
  source_url     text,
  city_slug      text not null references public.cities(slug) on delete restrict,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create index if not exists providers_cityslug_idx on public.providers (city_slug);
create index if not exists providers_zip_idx      on public.providers (zip);
create index if not exists providers_name_gin_idx on public.providers using gin (to_tsvector('simple', name));
create index if not exists providers_rating_idx   on public.providers (rating desc);

-- ZIP helper table
create table if not exists public.zip_mappings (
  zip        text primary key,
  city       text not null,
  state      text not null,
  lat        double precision not null,
  lng        double precision not null,
  city_slug  text not null references public.cities(slug)
);

create index if not exists zips_cityslug_idx on public.zip_mappings (city_slug);

-- Enable RLS (public read-only)
alter table public.cities        enable row level security;
alter table public.providers     enable row level security;
alter table public.zip_mappings  enable row level security;

create policy cities_read    on public.cities    for select using (true);
create policy providers_read on public.providers for select using (true);
create policy zip_read       on public.zip_mappings for select using (true);

-- Slug maintenance triggers
create or replace function public.providers_slugify_fn()
returns trigger language plpgsql as $$
begin
  if new.city_slug is null or length(new.city_slug)=0 then
    new.city_slug := slugify(new.city || '-' || new.state);
  end if;
  new.provider_slug := slugify(coalesce(new.name,'') || '-' || new.city_slug);
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists providers_slugify_trg on public.providers;
create trigger providers_slugify_trg
before insert or update of name, city_slug on public.providers
for each row execute function public.providers_slugify_fn();