alter type "public"."Social Media Platform" rename to "Social Media Platform__old_version_to_be_dropped";

create type "public"."Social Media Platform" as enum ('google', 'facebook', 'threads', 'twitter', 'tiktok');

alter table "public"."external_accounts" alter column platform type "public"."Social Media Platform" using platform::text::"public"."Social Media Platform";

drop type "public"."Social Media Platform__old_version_to_be_dropped";