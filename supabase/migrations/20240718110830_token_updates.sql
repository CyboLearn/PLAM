alter table "public"."external_accounts" add column "expiry" timestamp with time zone;

alter table "public"."external_accounts" add column "refresh_token" text;


