DROP POLICY IF EXISTS "Users self-assign basic roles" ON public.user_roles;
CREATE POLICY "Users self-assign basic roles" ON public.user_roles
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND role = ANY (ARRAY['client'::app_role, 'builder'::app_role, 'professional'::app_role, 'supplier'::app_role]));