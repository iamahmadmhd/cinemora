create table public.profiles (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  email character varying null default ''::character varying,
  birthdate date null,
  created_at timestamp without time zone null default now(),
  firstname text not null,
  lastname text not null,
  avatar text null,
  constraint profiles_pkey primary key (id),
  constraint profiles_username_key unique (email),
  constraint profiles_user_id_key unique (user_id),
  constraint profiles_user_id_fkey foreign KEY (user_id) references auth.users (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

create table public.lists (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  username text not null,
  name text not null,
  type text not null,
  is_public boolean null default false,
  allowed_users uuid[] null default '{}'::uuid[],
  created_at timestamp without time zone null default now(),
  constraint lists_pkey primary key (id),
  constraint lists_username_name_key unique (username, name),
  constraint lists_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create table public.list_items (
  id uuid not null default gen_random_uuid (),
  list_id uuid null,
  external_id text not null,
  title text not null,
  description text null,
  image_url text null,
  metadata jsonb null,
  created_at timestamp without time zone null default now(),
  constraint list_items_pkey primary key (id),
  constraint list_items_list_id_external_id_key unique (list_id, external_id)
) TABLESPACE pg_default;