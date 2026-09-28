CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller UUID := auth.uid();
BEGIN
  IF caller IS NULL THEN
    RETURN false;
  END IF;

  -- فحص الدور باستخدام القيمة الفعلية الموجودة في الـ Enum فقط
  IF EXISTS (
    SELECT 1 FROM public.profiles pr
    WHERE pr.id = caller 
    AND pr.role = 'platform_admin'::public.user_role
  ) THEN
    RETURN true;
  END IF;

  -- فحص جدول platform_admins كخيار أمان إضافي إن وجد
  BEGIN
    RETURN EXISTS (
      SELECT 1 FROM public.platform_admins pa
      WHERE pa.user_id = caller
    );
  EXCEPTION WHEN undefined_table THEN
    RETURN false;
  END;
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_platform_admin() TO authenticated, anon;