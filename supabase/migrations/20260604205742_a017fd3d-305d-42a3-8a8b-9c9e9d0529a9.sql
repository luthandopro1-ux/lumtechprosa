-- Fix: missing Data API GRANTs on new tables block admin dashboard reads.
-- RLS policies already restrict access correctly; we just need PostgREST to reach the tables.

GRANT SELECT, INSERT, UPDATE, DELETE ON public.suppliers TO authenticated;
GRANT ALL ON public.suppliers TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.supplier_documents TO authenticated;
GRANT ALL ON public.supplier_documents TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.boq_requests TO authenticated;
GRANT ALL ON public.boq_requests TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.escrow_ledger TO authenticated;
GRANT ALL ON public.escrow_ledger TO service_role;

GRANT SELECT, INSERT ON public.admin_audit_log TO authenticated;
GRANT ALL ON public.admin_audit_log TO service_role;

-- Belt-and-braces: ensure admins can SELECT all rows on escrow_ledger & suppliers
-- (existing policies already allow this via has_role, but make it explicit).
DROP POLICY IF EXISTS "Admin reads all suppliers" ON public.suppliers;
CREATE POLICY "Admin reads all suppliers" ON public.suppliers
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admin reads all escrow" ON public.escrow_ledger;
CREATE POLICY "Admin reads all escrow" ON public.escrow_ledger
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admin reads all boq" ON public.boq_requests;
CREATE POLICY "Admin reads all boq" ON public.boq_requests
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));