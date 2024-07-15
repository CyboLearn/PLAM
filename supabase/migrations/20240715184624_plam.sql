drop policy "Enable delete for users based on user_id" on "public"."social_accounts";

drop policy "Enable read access for all users" on "public"."social_accounts";

revoke delete on table "public"."social_accounts" from "anon";

revoke insert on table "public"."social_accounts" from "anon";

revoke references on table "public"."social_accounts" from "anon";

revoke select on table "public"."social_accounts" from "anon";

revoke trigger on table "public"."social_accounts" from "anon";

revoke truncate on table "public"."social_accounts" from "anon";

revoke update on table "public"."social_accounts" from "anon";

revoke delete on table "public"."social_accounts" from "authenticated";

revoke insert on table "public"."social_accounts" from "authenticated";

revoke references on table "public"."social_accounts" from "authenticated";

revoke select on table "public"."social_accounts" from "authenticated";

revoke trigger on table "public"."social_accounts" from "authenticated";

revoke truncate on table "public"."social_accounts" from "authenticated";

revoke update on table "public"."social_accounts" from "authenticated";

revoke delete on table "public"."social_accounts" from "service_role";

revoke insert on table "public"."social_accounts" from "service_role";

revoke references on table "public"."social_accounts" from "service_role";

revoke select on table "public"."social_accounts" from "service_role";

revoke trigger on table "public"."social_accounts" from "service_role";

revoke truncate on table "public"."social_accounts" from "service_role";

revoke update on table "public"."social_accounts" from "service_role";

alter table "public"."social_accounts" drop constraint "social_accounts_user_id_fkey";

alter table "public"."social_accounts" drop constraint "social_accounts_pkey";

drop index if exists "public"."social_accounts_pkey";

drop table "public"."social_accounts";

create table "public"."external_accounts" (
    "user_id" uuid not null,
    "external_account_id" text not null,
    "connected_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "access_token" text,
    "platform" "Social Media Platform" not null
);


alter table "public"."external_accounts" enable row level security;

CREATE UNIQUE INDEX social_accounts_pkey ON public.external_accounts USING btree (user_id, external_account_id);

alter table "public"."external_accounts" add constraint "social_accounts_pkey" PRIMARY KEY using index "social_accounts_pkey";

alter table "public"."external_accounts" add constraint "social_accounts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."external_accounts" validate constraint "social_accounts_user_id_fkey";

grant delete on table "public"."external_accounts" to "anon";

grant insert on table "public"."external_accounts" to "anon";

grant references on table "public"."external_accounts" to "anon";

grant select on table "public"."external_accounts" to "anon";

grant trigger on table "public"."external_accounts" to "anon";

grant truncate on table "public"."external_accounts" to "anon";

grant update on table "public"."external_accounts" to "anon";

grant delete on table "public"."external_accounts" to "authenticated";

grant insert on table "public"."external_accounts" to "authenticated";

grant references on table "public"."external_accounts" to "authenticated";

grant select on table "public"."external_accounts" to "authenticated";

grant trigger on table "public"."external_accounts" to "authenticated";

grant truncate on table "public"."external_accounts" to "authenticated";

grant update on table "public"."external_accounts" to "authenticated";

grant delete on table "public"."external_accounts" to "service_role";

grant insert on table "public"."external_accounts" to "service_role";

grant references on table "public"."external_accounts" to "service_role";

grant select on table "public"."external_accounts" to "service_role";

grant trigger on table "public"."external_accounts" to "service_role";

grant truncate on table "public"."external_accounts" to "service_role";

grant update on table "public"."external_accounts" to "service_role";

create policy "Enable delete for users based on user_id"
on "public"."external_accounts"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable read access for all users"
on "public"."external_accounts"
as permissive
for select
to public
using ((( SELECT auth.uid() AS uid) = user_id));



