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


