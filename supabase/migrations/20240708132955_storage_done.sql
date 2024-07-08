create type "public"."Chat Privacy" as enum ('Private', 'Public');

create type "public"."Service State" as enum ('Inactive', 'Beta Testing', 'Active');

create table "public"."enabled_services" (
    "service_id" uuid not null,
    "user_id" uuid not null,
    "is_enabled" boolean not null default false
);


alter table "public"."enabled_services" enable row level security;

create table "public"."services" (
    "service_id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "service_name" text not null,
    "service_slug" text not null,
    "is_enabled" boolean not null default false,
    "service_state" "Service State" not null default 'Inactive'::"Service State",
    "description" text
);


alter table "public"."services" enable row level security;

alter table "public"."chats" add column "privacy" "Chat Privacy" not null default 'Private'::"Chat Privacy";

CREATE UNIQUE INDEX enabled_services_pkey ON public.enabled_services USING btree (service_id, user_id);

CREATE UNIQUE INDEX services_pkey ON public.services USING btree (service_id);

CREATE UNIQUE INDEX services_service_slug_key ON public.services USING btree (service_slug);

alter table "public"."enabled_services" add constraint "enabled_services_pkey" PRIMARY KEY using index "enabled_services_pkey";

alter table "public"."services" add constraint "services_pkey" PRIMARY KEY using index "services_pkey";

alter table "public"."enabled_services" add constraint "public_enabled_services_service_id_fkey" FOREIGN KEY (service_id) REFERENCES services(service_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."enabled_services" validate constraint "public_enabled_services_service_id_fkey";

alter table "public"."enabled_services" add constraint "public_enabled_services_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."enabled_services" validate constraint "public_enabled_services_user_id_fkey";

alter table "public"."services" add constraint "services_service_slug_key" UNIQUE using index "services_service_slug_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.insert_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
    INSERT INTO public.users (user_id)
    VALUES (
      NEW.id
    );

    INSERT INTO public.user_details (user_id, email, avatar)
    VALUES (
      NEW.id,
      NEW.email,
      NEW.raw_user_meta_data ->> 'avatar_url'
    );

    RETURN NEW;
END;
$function$
;

grant delete on table "public"."enabled_services" to "anon";

grant insert on table "public"."enabled_services" to "anon";

grant references on table "public"."enabled_services" to "anon";

grant select on table "public"."enabled_services" to "anon";

grant trigger on table "public"."enabled_services" to "anon";

grant truncate on table "public"."enabled_services" to "anon";

grant update on table "public"."enabled_services" to "anon";

grant delete on table "public"."enabled_services" to "authenticated";

grant insert on table "public"."enabled_services" to "authenticated";

grant references on table "public"."enabled_services" to "authenticated";

grant select on table "public"."enabled_services" to "authenticated";

grant trigger on table "public"."enabled_services" to "authenticated";

grant truncate on table "public"."enabled_services" to "authenticated";

grant update on table "public"."enabled_services" to "authenticated";

grant delete on table "public"."enabled_services" to "service_role";

grant insert on table "public"."enabled_services" to "service_role";

grant references on table "public"."enabled_services" to "service_role";

grant select on table "public"."enabled_services" to "service_role";

grant trigger on table "public"."enabled_services" to "service_role";

grant truncate on table "public"."enabled_services" to "service_role";

grant update on table "public"."enabled_services" to "service_role";

grant delete on table "public"."services" to "anon";

grant insert on table "public"."services" to "anon";

grant references on table "public"."services" to "anon";

grant select on table "public"."services" to "anon";

grant trigger on table "public"."services" to "anon";

grant truncate on table "public"."services" to "anon";

grant update on table "public"."services" to "anon";

grant delete on table "public"."services" to "authenticated";

grant insert on table "public"."services" to "authenticated";

grant references on table "public"."services" to "authenticated";

grant select on table "public"."services" to "authenticated";

grant trigger on table "public"."services" to "authenticated";

grant truncate on table "public"."services" to "authenticated";

grant update on table "public"."services" to "authenticated";

grant delete on table "public"."services" to "service_role";

grant insert on table "public"."services" to "service_role";

grant references on table "public"."services" to "service_role";

grant select on table "public"."services" to "service_role";

grant trigger on table "public"."services" to "service_role";

grant truncate on table "public"."services" to "service_role";

grant update on table "public"."services" to "service_role";

create policy "Enable insert for users based on user_id"
on "public"."enabled_services"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable read access for all users"
on "public"."enabled_services"
as permissive
for select
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable update for users based on user_id"
on "public"."enabled_services"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable read access for all users"
on "public"."services"
as permissive
for select
to public
using (true);



