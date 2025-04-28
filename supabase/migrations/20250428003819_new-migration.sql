create type "public"."mediatype" as enum ('movie', 'tv');

create type "public"."status" as enum ('watched', 'not watched');

alter table "public"."watchlists" drop constraint "watchlists_pkey";

drop index if exists "public"."watchlists_pkey";

alter table "public"."watchlists" drop column "movie_id";

alter table "public"."watchlists" add column "genres" text[];

alter table "public"."watchlists" add column "href" text;

alter table "public"."watchlists" add column "media_id" text not null;

alter table "public"."watchlists" add column "media_type" mediatype;

alter table "public"."watchlists" add column "overview" text;

alter table "public"."watchlists" add column "status" status;

alter table "public"."watchlists" add column "vote_average" real;

CREATE UNIQUE INDEX watchlists_pkey ON public.watchlists USING btree (user_id, media_id, id);

alter table "public"."watchlists" add constraint "watchlists_pkey" PRIMARY KEY using index "watchlists_pkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$begin
  insert into public.profiles (id, firstname, lastname, email)
  values (new.id, new.raw_user_meta_data ->> 'firstname', new.raw_user_meta_data ->> 'lastname', new.email);
  return new;
end;$function$
;