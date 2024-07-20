create policy "Give users SELECT access to own folder"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'media'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


create policy "Give users INSERT access to own folder"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'media'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


create policy "Give users UPDATE access to own folder"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'media'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


create policy "Give users DELETE access to own folder"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'media'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));



