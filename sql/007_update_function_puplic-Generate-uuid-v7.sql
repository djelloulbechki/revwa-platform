-- =====================================================
-- 007: add or update function public generate uuid v7
-- =====================================================
CREATE OR REPLACE FUNCTION public.generate_uuid_v7()
RETURNS uuid
LANGUAGE plpgsql
PARALLEL SAFE
SET search_path = public, extensions
AS $function$
DECLARE
  unix_ts_ms BYTEA;
  uuid_bytes BYTEA;
BEGIN
  unix_ts_ms :=
    substring(
      int8send(
        floor(extract(epoch from clock_timestamp()) * 1000)::bigint
      )
      from 3
    );

  uuid_bytes :=
    unix_ts_ms || extensions.gen_random_bytes(10);

  -- set version to 7
  uuid_bytes :=
    set_byte(
      uuid_bytes,
      6,
      (get_byte(uuid_bytes, 6) & 15) | 112
    );

  -- set variant to RFC 4122
  uuid_bytes :=
    set_byte(
      uuid_bytes,
      8,
      (get_byte(uuid_bytes, 8) & 63) | 128
    );

  RETURN encode(uuid_bytes, 'hex')::uuid;
END;
$function$;