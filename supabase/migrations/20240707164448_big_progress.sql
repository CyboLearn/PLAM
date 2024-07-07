drop policy "Anyone can chat" on "public"."chats";

drop policy "Enable read access for all users" on "public"."chats";

alter table "public"."chats" add column "chat_title" text not null default 'New Chat'::text;

alter table "public"."chats" add column "user_id" uuid not null;

alter table "public"."chats" alter column "chat" set default '{}'::jsonb[];

alter table "public"."chats" alter column "chat" set data type jsonb[] using "chat"::jsonb[];

alter table "public"."chats" add constraint "public_chats_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."chats" validate constraint "public_chats_user_id_fkey";

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


create policy "Enable update for users based on user id"
on "public"."chats"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable read access for all users"
on "public"."chats"
as permissive
for select
to public
using ((( SELECT auth.uid() AS uid) = user_id));


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
