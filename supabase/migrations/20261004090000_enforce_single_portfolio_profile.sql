-- Enforce the existing application contract that `profiles` is a singleton.
-- The anonymous SELECT policy in the prior migration makes current public row
-- visibility checkable before applying this index. This migration intentionally
-- fails (without deleting or changing data) if duplicates exist; resolve those
-- rows manually with the owner before retrying.
create unique index if not exists profiles_singleton_row_idx
    on public.profiles ((true));

-- Rollback, if required:
-- drop index if exists public.profiles_singleton_row_idx;
