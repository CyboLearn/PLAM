create type "public"."Social Media Platform" as enum ('google', 'facebook', 'threads');

create table "public"."social_accounts" (
    "user_id" uuid not null,
    "external_account_id" text not null,
    "connected_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "access_token" text,
    "platform" "Social Media Platform" not null
);


alter table "public"."social_accounts" enable row level security;

CREATE UNIQUE INDEX social_accounts_pkey ON public.social_accounts USING btree (user_id, external_account_id);

alter table "public"."social_accounts" add constraint "social_accounts_pkey" PRIMARY KEY using index "social_accounts_pkey";

alter table "public"."social_accounts" add constraint "social_accounts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."social_accounts" validate constraint "social_accounts_user_id_fkey";

grant delete on table "public"."social_accounts" to "anon";

grant insert on table "public"."social_accounts" to "anon";

grant references on table "public"."social_accounts" to "anon";

grant select on table "public"."social_accounts" to "anon";

grant trigger on table "public"."social_accounts" to "anon";

grant truncate on table "public"."social_accounts" to "anon";

grant update on table "public"."social_accounts" to "anon";

grant delete on table "public"."social_accounts" to "authenticated";

grant insert on table "public"."social_accounts" to "authenticated";

grant references on table "public"."social_accounts" to "authenticated";

grant select on table "public"."social_accounts" to "authenticated";

grant trigger on table "public"."social_accounts" to "authenticated";

grant truncate on table "public"."social_accounts" to "authenticated";

grant update on table "public"."social_accounts" to "authenticated";

grant delete on table "public"."social_accounts" to "service_role";

grant insert on table "public"."social_accounts" to "service_role";

grant references on table "public"."social_accounts" to "service_role";

grant select on table "public"."social_accounts" to "service_role";

grant trigger on table "public"."social_accounts" to "service_role";

grant truncate on table "public"."social_accounts" to "service_role";

grant update on table "public"."social_accounts" to "service_role";

create policy "Enable delete for users based on user_id"
on "public"."social_accounts"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable read access for all users"
on "public"."social_accounts"
as permissive
for select
to public
using ((( SELECT auth.uid() AS uid) = user_id));



