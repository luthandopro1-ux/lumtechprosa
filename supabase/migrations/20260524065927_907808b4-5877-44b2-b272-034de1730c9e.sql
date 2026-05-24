
-- Roles
CREATE TYPE public.app_role AS ENUM ('client', 'builder', 'professional', 'supplier', 'admin');
CREATE TYPE public.project_status AS ENUM ('draft', 'funded', 'active', 'completed', 'disputed', 'cancelled');
CREATE TYPE public.milestone_status AS ENUM ('pending', 'active', 'awaiting_signoff', 'approved', 'paid');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  company_name TEXT,
  email TEXT,
  nhbrc_number TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles (separate table for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer role check
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Projects
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  builder_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  budget_cents BIGINT NOT NULL,
  tier SMALLINT NOT NULL CHECK (tier IN (1, 2, 3)),
  contractor_supplies_material BOOLEAN NOT NULL DEFAULT true,
  use_inhouse_professionals BOOLEAN NOT NULL DEFAULT false,
  client_fee_cents BIGINT NOT NULL DEFAULT 0,
  builder_fee_cents BIGINT NOT NULL DEFAULT 0,
  professional_fee_cents BIGINT NOT NULL DEFAULT 0,
  status public.project_status NOT NULL DEFAULT 'draft',
  kzn_region TEXT NOT NULL,
  tradesafe_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Milestones
CREATE TABLE public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  payout_amount_cents BIGINT NOT NULL,
  status public.milestone_status NOT NULL DEFAULT 'pending',
  qs_approved BOOLEAN NOT NULL DEFAULT false,
  engineer_approved BOOLEAN NOT NULL DEFAULT false,
  proof_notes TEXT,
  ordinal INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

-- Vouchers
CREATE TABLE public.vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  value_cents BIGINT NOT NULL,
  voucher_code TEXT NOT NULL UNIQUE CHECK (char_length(voucher_code) = 12),
  is_redeemed BOOLEAN NOT NULL DEFAULT false,
  redeemed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;

-- RLS Policies: profiles
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admins view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- RLS: user_roles (no self-grant of admin)
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users pick non-admin role" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND role <> 'admin');
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS: projects
CREATE POLICY "Clients see own projects" ON public.projects FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Builders see assigned" ON public.projects FOR SELECT TO authenticated USING (auth.uid() = builder_id);
CREATE POLICY "Builders see open" ON public.projects FOR SELECT TO authenticated USING (builder_id IS NULL AND public.has_role(auth.uid(), 'builder'));
CREATE POLICY "Professionals see all" ON public.projects FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'professional'));
CREATE POLICY "Admins see all projects" ON public.projects FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients create projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id AND public.has_role(auth.uid(), 'client'));
CREATE POLICY "Owner or builder update" ON public.projects FOR UPDATE TO authenticated USING (auth.uid() = owner_id OR auth.uid() = builder_id OR public.has_role(auth.uid(), 'admin'));

-- RLS: milestones
CREATE POLICY "View milestones of accessible projects" ON public.milestones FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.owner_id = auth.uid() OR p.builder_id = auth.uid() OR public.has_role(auth.uid(), 'professional') OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "Owner creates milestones" ON public.milestones FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.owner_id = auth.uid())
);
CREATE POLICY "Builder/Professional/Admin update milestones" ON public.milestones FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.builder_id = auth.uid() OR p.owner_id = auth.uid() OR public.has_role(auth.uid(), 'professional') OR public.has_role(auth.uid(), 'admin')))
);

-- RLS: vouchers
CREATE POLICY "Project parties view vouchers" ON public.vouchers FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.owner_id = auth.uid() OR p.builder_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
  OR supplier_id = auth.uid()
  OR public.has_role(auth.uid(), 'supplier')
);
CREATE POLICY "Project owner creates voucher" ON public.vouchers FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.owner_id = auth.uid() OR p.builder_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "Supplier redeems voucher" ON public.vouchers FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'supplier') OR public.has_role(auth.uid(), 'admin'));

-- Trigger: auto profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
