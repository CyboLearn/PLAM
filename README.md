# Personal Large Action Model (PLAM)

### Supabase Migrations

#### Schema:

```
supabase db diff --schema public,extensions,auth,storage -f <name_of_migration>
```

#### Data:

As a general rule, if the table can be modified by users, exclude it.

```
supabase db dump --data-only --schema public --local -f supabase/seed.sql --exclude public.chats,public.enabled_services,public.users,public.user_details
```