-- Schéma du prototype Bien Paré. À appliquer sur un projet Supabase DÉDIÉ
-- (jamais sur ac-sat-campagne).
-- Principe : les visiteurs (rôle anon) peuvent uniquement INSÉRER ; personne
-- ne peut lire via l'API publique. L'analyse se fait par export CSV depuis le
-- tableau de bord Supabase (compte propriétaire).

create table if not exists public.events (
  id bigint generated always as identity primary key,
  received_at timestamptz not null default now(),
  event text not null check (event in (
    'page_view','collection_view','product_view','interest_click',
    'add_to_cart','remove_from_cart','checkout_started',
    'feedback_submitted','digital_download'
  )),
  occurred_at timestamptz not null,
  session_id text check (char_length(session_id) <= 64),
  traffic_mode text not null check (traffic_mode in ('test','demo','visitor')),
  period text check (char_length(period) <= 40),
  page text check (char_length(page) <= 80),
  product_id text check (char_length(product_id) <= 40),
  universe text check (universe in ('automobile','equitation')),
  product_type text check (product_type in ('physique','numerique')),
  variant text check (char_length(variant) <= 40),
  referrer_domain text check (char_length(referrer_domain) <= 255),
  utm_source text check (char_length(utm_source) <= 40),
  is_simulated boolean not null default false
);

create table if not exists public.feedback (
  id bigint generated always as identity primary key,
  received_at timestamptz not null default now(),
  product_interest text not null check (char_length(product_interest) <= 40),
  problem text check (char_length(problem) <= 500),
  price_opinion text not null check (price_opinion in ('acceptable','trop_cher','tres_abordable','ne_sait_pas')),
  hesitation text check (char_length(hesitation) <= 500),
  wish text check (char_length(wish) <= 200),
  contact_ok boolean not null default false,
  email text check (char_length(email) <= 254),
  traffic_mode text not null check (traffic_mode in ('test','demo','visitor')),
  period text check (char_length(period) <= 40),
  -- un e-mail n'est accepté qu'avec consentement explicite
  constraint email_requires_consent check (email is null or contact_ok)
);

alter table public.events enable row level security;
alter table public.feedback enable row level security;

create policy "anon insert events" on public.events
  for insert to anon with check (true);
create policy "anon insert feedback" on public.feedback
  for insert to anon with check (true);

-- Aucune policy SELECT/UPDATE/DELETE : lecture impossible via l'API publique.
revoke select, update, delete on public.events from anon, authenticated;
revoke select, update, delete on public.feedback from anon, authenticated;

create index if not exists events_occurred_at_idx on public.events (occurred_at);
create index if not exists events_mode_idx on public.events (traffic_mode);
