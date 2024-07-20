DELETE FROM "storage"."buckets"
WHERE "id" = 'media';

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('media', 'media', NULL, '2024-07-18 13:42:03.369549+00', '2024-07-18 13:42:03.369549+00', false, false, NULL, '{image/*,audio/*,video/*,application/octet-stream,text/plain}', NULL),
	('open', 'open', NULL, '2024-07-20 10:51:53.666802+00', '2024-07-20 10:51:53.666802+00', true, false, NULL, '{image/*,audio/*,video/*,application/octet-stream,text/plain}', NULL);

CREATE TRIGGER "create-user-storage-space" AFTER INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('http://host.docker.internal:54321/functions/v1/create-user-space', 'POST', '{"Content-type":"application/json","Authorization":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"}', '{}', '5000');

CREATE TRIGGER "delete-user-storage-space" AFTER DELETE ON public.users FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('http://host.docker.internal:54321/functions/v1/delete-user-space', 'POST', '{"Content-type":"application/json","Authorization":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"}', '{}', '5000');

