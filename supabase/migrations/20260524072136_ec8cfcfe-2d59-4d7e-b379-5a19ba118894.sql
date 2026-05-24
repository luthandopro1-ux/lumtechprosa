
-- 1) Restrict self-service role assignment to non-sensitive roles only
DROP POLICY IF EXISTS "Users pick non-admin role" ON public.user_roles;

CREATE POLICY "Users self-assign basic roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND role IN ('client'::app_role, 'builder'::app_role)
);

-- 2) Remove blanket "professionals see all projects" policy.
--    Replace with: only admins can grant project visibility to professionals
--    via assignment (future), and professionals can only see projects they
--    are explicitly assigned to (via builder_id or as owner). For now we
--    simply drop the over-broad policy.
DROP POLICY IF EXISTS "Professionals see all" ON public.projects;

-- 3) Tighten milestone update policy: remove blanket "any professional can update"
DROP POLICY IF EXISTS "Builder/Professional/Admin update milestones" ON public.milestones;

CREATE POLICY "Project parties update milestones"
ON public.milestones
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = milestones.project_id
      AND (p.builder_id = auth.uid() OR p.owner_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
  )
);

-- 4) Tighten milestone SELECT (remove blanket professional read)
DROP POLICY IF EXISTS "View milestones of accessible projects" ON public.milestones;

CREATE POLICY "View milestones of accessible projects"
ON public.milestones
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = milestones.project_id
      AND (p.owner_id = auth.uid() OR p.builder_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
  )
);

-- 5) Tighten voucher SELECT: project parties + the assigned supplier only.
--    Remove the blanket "any supplier-role user" grant.
DROP POLICY IF EXISTS "Project parties view vouchers" ON public.vouchers;

CREATE POLICY "Project parties view vouchers"
ON public.vouchers
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = vouchers.project_id
      AND (p.owner_id = auth.uid() OR p.builder_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
  )
  OR supplier_id = auth.uid()
);

-- 6) Tighten voucher UPDATE: only the assigned supplier (or admin) can redeem.
--    Allow an unassigned voucher to be claimed by a supplier-role user in
--    the same UPDATE (supplier_id transitions from NULL to auth.uid()).
DROP POLICY IF EXISTS "Supplier redeems voucher" ON public.vouchers;

CREATE POLICY "Supplier redeems voucher"
ON public.vouchers
FOR UPDATE
TO authenticated
USING (
  supplier_id = auth.uid()
  OR (supplier_id IS NULL AND has_role(auth.uid(), 'supplier'::app_role))
  OR has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  supplier_id = auth.uid()
  OR has_role(auth.uid(), 'admin'::app_role)
);
