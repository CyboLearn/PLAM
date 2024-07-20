DELETE FROM "storage"."buckets"
WHERE "id" = 'media';

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('media', 'media', NULL, '2024-07-18 13:42:03.369549+00', '2024-07-18 13:42:03.369549+00', false, false, NULL, '{image/*,audio/*,video/*,application/octet-stream,text/plain}', NULL),
	('open', 'open', NULL, '2024-07-20 10:51:53.666802+00', '2024-07-20 10:51:53.666802+00', true, false, NULL, '{image/*,audio/*,video/*,application/octet-stream,text/plain}', NULL);