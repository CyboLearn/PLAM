create type "public"."Account Status" as enum ('Active', 'Inactive', 'Suspended', 'Terminated');

create type "public"."User Role" as enum ('Guest', 'User', 'Tester', 'Administrator', 'Moderator', 'Owner');

create table "public"."chats" (
    "chat_id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "chat" jsonb[] not null default '{}'::jsonb[],
    "user_id" uuid not null,
    "chat_title" text not null default 'New Chat'::text
);


alter table "public"."chats" enable row level security;

create table "public"."user_details" (
    "user_id" uuid not null,
    "name" text,
    "email" text,
    "avatar" text
);


alter table "public"."user_details" enable row level security;

create table "public"."users" (
    "user_id" uuid not null,
    "joined_at" timestamp with time zone not null default now(),
    "role" "User Role" not null default 'User'::"User Role",
    "status" "Account Status" not null default 'Active'::"Account Status"
);


alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX chats_pkey ON public.chats USING btree (chat_id);

CREATE UNIQUE INDEX user_details_pkey ON public.user_details USING btree (user_id);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (user_id);

alter table "public"."chats" add constraint "chats_pkey" PRIMARY KEY using index "chats_pkey";

alter table "public"."user_details" add constraint "user_details_pkey" PRIMARY KEY using index "user_details_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."chats" add constraint "public_chats_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."chats" validate constraint "public_chats_user_id_fkey";

alter table "public"."user_details" add constraint "public_user_details_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_details" validate constraint "public_user_details_user_id_fkey";

alter table "public"."users" add constraint "public_users_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "public_users_user_id_fkey";

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

grant delete on table "public"."chats" to "anon";

grant insert on table "public"."chats" to "anon";

grant references on table "public"."chats" to "anon";

grant select on table "public"."chats" to "anon";

grant trigger on table "public"."chats" to "anon";

grant truncate on table "public"."chats" to "anon";

grant update on table "public"."chats" to "anon";

grant delete on table "public"."chats" to "authenticated";

grant insert on table "public"."chats" to "authenticated";

grant references on table "public"."chats" to "authenticated";

grant select on table "public"."chats" to "authenticated";

grant trigger on table "public"."chats" to "authenticated";

grant truncate on table "public"."chats" to "authenticated";

grant update on table "public"."chats" to "authenticated";

grant delete on table "public"."chats" to "service_role";

grant insert on table "public"."chats" to "service_role";

grant references on table "public"."chats" to "service_role";

grant select on table "public"."chats" to "service_role";

grant trigger on table "public"."chats" to "service_role";

grant truncate on table "public"."chats" to "service_role";

grant update on table "public"."chats" to "service_role";

grant delete on table "public"."user_details" to "anon";

grant insert on table "public"."user_details" to "anon";

grant references on table "public"."user_details" to "anon";

grant select on table "public"."user_details" to "anon";

grant trigger on table "public"."user_details" to "anon";

grant truncate on table "public"."user_details" to "anon";

grant update on table "public"."user_details" to "anon";

grant delete on table "public"."user_details" to "authenticated";

grant insert on table "public"."user_details" to "authenticated";

grant references on table "public"."user_details" to "authenticated";

grant select on table "public"."user_details" to "authenticated";

grant trigger on table "public"."user_details" to "authenticated";

grant truncate on table "public"."user_details" to "authenticated";

grant update on table "public"."user_details" to "authenticated";

grant delete on table "public"."user_details" to "service_role";

grant insert on table "public"."user_details" to "service_role";

grant references on table "public"."user_details" to "service_role";

grant select on table "public"."user_details" to "service_role";

grant trigger on table "public"."user_details" to "service_role";

grant truncate on table "public"."user_details" to "service_role";

grant update on table "public"."user_details" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

create policy "Enable delete for users based on user_id"
on "public"."chats"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for users based on user_id"
on "public"."chats"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable read access for all users"
on "public"."chats"
as permissive
for select
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable update for users based on user id"
on "public"."chats"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable read access for all users"
on "public"."user_details"
as permissive
for select
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable update for users based on email"
on "public"."user_details"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable read access for all users"
on "public"."users"
as permissive
for select
to public
using ((( SELECT auth.uid() AS uid) = user_id));



CREATE TRIGGER create_user_on_signup AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION insert_user();


INSERT INTO storage.buckets (id, name, public, allowed_mime_types) 
VALUES ('media', 'media', false, ARRAY['image/*', 'audio/*', 'video/*']);


create policy "Give users access to own folder 1ps738_0"
on "storage"."objects"
as permissive
for select
to public
using (((bucket_id = 'media'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


create policy "Give users access to own folder 1ps738_1"
on "storage"."objects"
as permissive
for insert
to public
with check (((bucket_id = 'media'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


create policy "Give users access to own folder 1ps738_2"
on "storage"."objects"
as permissive
for update
to public
using (((bucket_id = 'media'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


create policy "Give users access to own folder 1ps738_3"
on "storage"."objects"
as permissive
for delete
to public
using (((bucket_id = 'media'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));



