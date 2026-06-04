
-- ============================================================
-- Suppliers, BOQ requests, escrow ledger, admin audit
-- ============================================================

-- 1. Extend projects: track real platform fee + escrow balance
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS platform_fee_pct numeric(4,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS platform_fee_cents bigint NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS contractor_net_cents bigint NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS escrow_balance_cents bigint NOT NULL DEFAULT 0;

-- 2. BOQ Requests
DO $$ BEGIN
  CREATE TYPE public.boq_service_type AS ENUM ('preliminary', 'detailed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.boq_request_status AS ENUM ('pending_payment','paid','in_review','delivered','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.boq_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  requested_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_type public.boq_service_type NOT NULL,
  fee_cents bigint NOT NULL,
  status public.boq_request_status NOT NULL DEFAULT 'pending_payment',
  notes text,
  deliverable_url text,
  paid_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.boq_requests TO authenticated;
GRANT ALL ON public.boq_requests TO service_role;
ALTER TABLE public.boq_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Client creates own BOQ request" ON public.boq_requests
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = requested_by AND EXISTS(
    SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.owner_id = auth.uid()
  ));
CREATE POLICY "Client sees own BOQ requests" ON public.boq_requests
  FOR SELECT TO authenticated
  USING (auth.uid() = requested_by OR public.has_role(auth.uid(),'admin'::app_role) OR public.has_role(auth.uid(),'professional'::app_role));
CREATE POLICY "Admin/professional updates BOQ" ON public.boq_requests
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin'::app_role) OR public.has_role(auth.uid(),'professional'::app_role))
  WITH CHECK (public.has_role(auth.uid(),'admin'::app_role) OR public.has_role(auth.uid(),'professional'::app_role));

-- 3. Suppliers
DO $$ BEGIN
  CREATE TYPE public.supplier_status AS ENUM ('pending','approved','suspended','rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.supplier_category AS ENUM (
    'building_materials','hardware','electrical','plumbing','roofing','concrete',
    'steel','timber','paint','aluminium','glass','solar_equipment','plant_hire','tool_hire','safety_equipment'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE SEQUENCE IF NOT EXISTS public.supplier_voucher_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE FUNCTION public.generate_supplier_voucher_code()
RETURNS text LANGUAGE sql VOLATILE SECURITY DEFINER SET search_path = public AS $$
  SELECT 'LTP-SA-SUP-' || lpad(nextval('public.supplier_voucher_seq')::text, 6, '0');
$$;

CREATE TABLE IF NOT EXISTS public.suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  registration_no text,
  tax_no text,
  categories public.supplier_category[] NOT NULL DEFAULT '{}',
  contact_phone text,
  contact_email text,
  physical_address text,
  banking_account_holder text,
  banking_bank text,
  banking_account_no text,
  banking_branch_code text,
  agreement_signed boolean NOT NULL DEFAULT false,
  status public.supplier_status NOT NULL DEFAULT 'pending',
  voucher_code text UNIQUE,
  voucher_issued_at timestamptz,
  voucher_expires_at timestamptz,
  rejection_reason text,
  approved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.suppliers TO authenticated;
GRANT ALL ON public.suppliers TO service_role;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Supplier sees own row" ON public.suppliers
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Approved suppliers visible to all authed" ON public.suppliers
  FOR SELECT TO authenticated
  USING (status = 'approved');
CREATE POLICY "Supplier creates own row" ON public.suppliers
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND public.has_role(auth.uid(),'supplier'::app_role));
CREATE POLICY "Supplier updates own pending row" ON public.suppliers
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND status IN ('pending','suspended','rejected'))
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admin manages suppliers" ON public.suppliers
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(),'admin'::app_role));

-- Auto-issue voucher when supplier becomes approved
CREATE OR REPLACE FUNCTION public.suppliers_issue_voucher()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM 'approved') THEN
    IF NEW.voucher_code IS NULL THEN
      NEW.voucher_code := public.generate_supplier_voucher_code();
    END IF;
    NEW.voucher_issued_at := COALESCE(NEW.voucher_issued_at, now());
    NEW.voucher_expires_at := COALESCE(NEW.voucher_expires_at, now() + interval '12 months');
    NEW.approved_at := COALESCE(NEW.approved_at, now());
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS suppliers_voucher_trigger ON public.suppliers;
CREATE TRIGGER suppliers_voucher_trigger
BEFORE UPDATE ON public.suppliers
FOR EACH ROW EXECUTE FUNCTION public.suppliers_issue_voucher();

-- 4. Supplier documents
CREATE TABLE IF NOT EXISTS public.supplier_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  doc_type text NOT NULL,
  file_url text NOT NULL,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, DELETE ON public.supplier_documents TO authenticated;
GRANT ALL ON public.supplier_documents TO service_role;
ALTER TABLE public.supplier_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Supplier manages own docs" ON public.supplier_documents
  FOR ALL TO authenticated
  USING (EXISTS(SELECT 1 FROM public.suppliers s WHERE s.id = supplier_id AND (s.user_id = auth.uid() OR public.has_role(auth.uid(),'admin'::app_role))))
  WITH CHECK (EXISTS(SELECT 1 FROM public.suppliers s WHERE s.id = supplier_id AND (s.user_id = auth.uid() OR public.has_role(auth.uid(),'admin'::app_role))));

-- 5. Escrow ledger (internal — TradeSafe sync later)
DO $$ BEGIN
  CREATE TYPE public.escrow_entry_type AS ENUM (
    'deposit','milestone_release','platform_fee','professional_fee','boq_fee','refund','adjustment'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.escrow_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  boq_request_id uuid REFERENCES public.boq_requests(id) ON DELETE SET NULL,
  milestone_id uuid REFERENCES public.milestones(id) ON DELETE SET NULL,
  entry_type public.escrow_entry_type NOT NULL,
  amount_cents bigint NOT NULL,
  memo text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.escrow_ledger TO authenticated;
GRANT ALL ON public.escrow_ledger TO service_role;
ALTER TABLE public.escrow_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project parties see ledger" ON public.escrow_ledger
  FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(),'admin'::app_role)
    OR EXISTS(SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.owner_id = auth.uid() OR p.builder_id = auth.uid()))
  );
CREATE POLICY "Admin writes ledger" ON public.escrow_ledger
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin'::app_role));

-- 6. Admin audit log
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_table text,
  target_id uuid,
  payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.admin_audit_log TO authenticated;
GRANT ALL ON public.admin_audit_log TO service_role;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin reads audit log" ON public.admin_audit_log
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Authenticated writes audit log" ON public.admin_audit_log
  FOR INSERT TO authenticated WITH CHECK (actor_id = auth.uid());
