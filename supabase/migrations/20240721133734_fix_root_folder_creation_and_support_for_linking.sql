create table "public"."storage_objects" (
    "object_id" uuid not null,
    "user_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "path" text not null
);


alter table "public"."storage_objects" enable row level security;

create table "public"."user_storage" (
    "object_id" uuid not null,
    "tags" text[] not null default '{}'::text[],
    "user_id" uuid not null
);


alter table "public"."user_storage" enable row level security;

CREATE UNIQUE INDEX storage_objects_object_user_unique ON public.storage_objects USING btree (object_id, user_id);

CREATE UNIQUE INDEX storage_objects_pkey ON public.storage_objects USING btree (object_id);

CREATE UNIQUE INDEX user_storage_pkey ON public.user_storage USING btree (object_id);

alter table "public"."storage_objects" add constraint "storage_objects_pkey" PRIMARY KEY using index "storage_objects_pkey";

alter table "public"."user_storage" add constraint "user_storage_pkey" PRIMARY KEY using index "user_storage_pkey";

alter table "public"."storage_objects" add constraint "storage_objects_object_id_fkey" FOREIGN KEY (object_id) REFERENCES storage.objects(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."storage_objects" validate constraint "storage_objects_object_id_fkey";

alter table "public"."storage_objects" add constraint "storage_objects_object_user_unique" UNIQUE using index "storage_objects_object_user_unique";

alter table "public"."storage_objects" add constraint "storage_objects_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."storage_objects" validate constraint "storage_objects_user_id_fkey";

alter table "public"."user_storage" add constraint "user_storage_object_user_fkey" FOREIGN KEY (object_id, user_id) REFERENCES storage_objects(object_id, user_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_storage" validate constraint "user_storage_object_user_fkey";

grant delete on table "public"."storage_objects" to "anon";

grant insert on table "public"."storage_objects" to "anon";

grant references on table "public"."storage_objects" to "anon";

grant select on table "public"."storage_objects" to "anon";

grant trigger on table "public"."storage_objects" to "anon";

grant truncate on table "public"."storage_objects" to "anon";

grant update on table "public"."storage_objects" to "anon";

grant delete on table "public"."storage_objects" to "authenticated";

grant insert on table "public"."storage_objects" to "authenticated";

grant references on table "public"."storage_objects" to "authenticated";

grant select on table "public"."storage_objects" to "authenticated";

grant trigger on table "public"."storage_objects" to "authenticated";

grant truncate on table "public"."storage_objects" to "authenticated";

grant update on table "public"."storage_objects" to "authenticated";

grant delete on table "public"."storage_objects" to "service_role";

grant insert on table "public"."storage_objects" to "service_role";

grant references on table "public"."storage_objects" to "service_role";

grant select on table "public"."storage_objects" to "service_role";

grant trigger on table "public"."storage_objects" to "service_role";

grant truncate on table "public"."storage_objects" to "service_role";

grant update on table "public"."storage_objects" to "service_role";

grant delete on table "public"."user_storage" to "anon";

grant insert on table "public"."user_storage" to "anon";

grant references on table "public"."user_storage" to "anon";

grant select on table "public"."user_storage" to "anon";

grant trigger on table "public"."user_storage" to "anon";

grant truncate on table "public"."user_storage" to "anon";

grant update on table "public"."user_storage" to "anon";

grant delete on table "public"."user_storage" to "authenticated";

grant insert on table "public"."user_storage" to "authenticated";

grant references on table "public"."user_storage" to "authenticated";

grant select on table "public"."user_storage" to "authenticated";

grant trigger on table "public"."user_storage" to "authenticated";

grant truncate on table "public"."user_storage" to "authenticated";

grant update on table "public"."user_storage" to "authenticated";

grant delete on table "public"."user_storage" to "service_role";

grant insert on table "public"."user_storage" to "service_role";

grant references on table "public"."user_storage" to "service_role";

grant select on table "public"."user_storage" to "service_role";

grant trigger on table "public"."user_storage" to "service_role";

grant truncate on table "public"."user_storage" to "service_role";

grant update on table "public"."user_storage" to "service_role";

create policy "Enable read access for owner"
on "public"."storage_objects"
as permissive
for select
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable read access for owner"
on "public"."user_storage"
as permissive
for select
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Only owner can update"
on "public"."user_storage"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = user_id));

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION storage.handle_storage_objects_changes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Handle INSERT
        INSERT INTO public.storage_objects (object_id, user_id, path)
        VALUES (NEW.id, NEW.owner, NEW.name)
        ON CONFLICT (object_id) DO NOTHING;

        INSERT INTO public.user_storage (object_id, user_id)
        VALUES (NEW.id, NEW.owner)
        ON CONFLICT (object_id) DO NOTHING;

    ELSIF TG_OP = 'UPDATE' THEN
        -- Handle UPDATE
        UPDATE public.storage_objects
        SET path = NEW.name,
            user_id = NEW.owner
        WHERE object_id = NEW.id;

        UPDATE public.user_storage
        SET user_id = NEW.owner
        WHERE object_id = NEW.id;

    ELSIF TG_OP = 'DELETE' THEN
        -- Handle DELETE
        DELETE FROM public.storage_objects
        WHERE object_id = OLD.id;

        DELETE FROM public.user_storage
        WHERE object_id = OLD.id;
    END IF;

    RETURN NULL;
END;
$function$
;

CREATE TRIGGER storage_objects_changes_trigger AFTER INSERT OR DELETE OR UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.handle_storage_objects_changes();


