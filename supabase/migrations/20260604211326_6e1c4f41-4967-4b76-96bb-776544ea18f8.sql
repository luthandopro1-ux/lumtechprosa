
-- project_documents: contracts, plans, signed-off proofs
CREATE TABLE public.project_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  uploaded_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doc_type text NOT NULL CHECK (doc_type IN ('contract','plan','boq','permit','proof','invoice','other')),
  title text NOT NULL,
  storage_path text NOT NULL,
  mime_type text,
  size_bytes bigint,
  signed_by_client_at timestamptz,
  signed_by_builder_at timestamptz,
  signed_by_professional_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_documents TO authenticated;
GRANT ALL ON public.project_documents TO service_role;
ALTER TABLE public.project_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project parties read documents" ON public.project_documents FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.owner_id = auth.uid() OR p.builder_id = auth.uid()))
);
CREATE POLICY "Project parties upload documents" ON public.project_documents FOR INSERT TO authenticated
WITH CHECK (
  uploaded_by = auth.uid() AND (
    has_role(auth.uid(),'admin'::app_role)
    OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.owner_id = auth.uid() OR p.builder_id = auth.uid()))
  )
);
CREATE POLICY "Project parties update documents" ON public.project_documents FOR UPDATE TO authenticated
USING (
  has_role(auth.uid(),'admin'::app_role)
  OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.owner_id = auth.uid() OR p.builder_id = auth.uid()))
);
CREATE POLICY "Uploader or admin deletes documents" ON public.project_documents FOR DELETE TO authenticated
USING (uploaded_by = auth.uid() OR has_role(auth.uid(),'admin'::app_role));

-- project_milestones: lightweight visual progress tracker (separate from financial milestones table)
CREATE TABLE public.project_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  ordinal integer NOT NULL DEFAULT 1,
  title text NOT NULL,
  description text,
  progress_pct smallint NOT NULL DEFAULT 0 CHECK (progress_pct BETWEEN 0 AND 100),
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started','in_progress','completed','blocked')),
  due_date date,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_milestones TO authenticated;
GRANT ALL ON public.project_milestones TO service_role;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project parties read progress" ON public.project_milestones FOR SELECT TO authenticated
USING (
  has_role(auth.uid(),'admin'::app_role)
  OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.owner_id = auth.uid() OR p.builder_id = auth.uid()))
);
CREATE POLICY "Owner or builder manage progress" ON public.project_milestones FOR ALL TO authenticated
USING (
  has_role(auth.uid(),'admin'::app_role)
  OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.owner_id = auth.uid() OR p.builder_id = auth.uid()))
)
WITH CHECK (
  has_role(auth.uid(),'admin'::app_role)
  OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.owner_id = auth.uid() OR p.builder_id = auth.uid()))
);

-- artisan_badges: skill / certification badges showcased in artisan profile
CREATE TABLE public.artisan_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_code text NOT NULL,
  title text NOT NULL,
  description text,
  issuer text,
  issued_at date,
  expires_at date,
  verified boolean NOT NULL DEFAULT false,
  icon_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, badge_code)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.artisan_badges TO authenticated;
GRANT ALL ON public.artisan_badges TO service_role;
ALTER TABLE public.artisan_badges ENABLE ROW LEVEL SECURITY;

-- Badges are public-discoverable to any signed-in user (marketplace browsing)
CREATE POLICY "Badges visible to authenticated" ON public.artisan_badges FOR SELECT TO authenticated USING (true);
CREATE POLICY "Owner inserts own badges" ON public.artisan_badges FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Owner updates own badges" ON public.artisan_badges FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Owner or admin deletes badges" ON public.artisan_badges FOR DELETE TO authenticated
USING (user_id = auth.uid() OR has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Admin verifies badges" ON public.artisan_badges FOR UPDATE TO authenticated
USING (has_role(auth.uid(),'admin'::app_role));

-- updated_at triggers
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER trg_project_documents_touch BEFORE UPDATE ON public.project_documents
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_project_milestones_touch BEFORE UPDATE ON public.project_milestones
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_artisan_badges_touch BEFORE UPDATE ON public.artisan_badges
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Storage RLS for the project-files bucket (created via storage tool)
CREATE POLICY "Project parties read project files" ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'project-files' AND (
    has_role(auth.uid(),'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id::text = split_part(name,'/',1)
        AND (p.owner_id = auth.uid() OR p.builder_id = auth.uid())
    )
  )
);
CREATE POLICY "Project parties upload project files" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'project-files' AND (
    has_role(auth.uid(),'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id::text = split_part(name,'/',1)
        AND (p.owner_id = auth.uid() OR p.builder_id = auth.uid())
    )
  )
);
CREATE POLICY "Owner or admin deletes project files" ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'project-files' AND (
    has_role(auth.uid(),'admin'::app_role)
    OR owner = auth.uid()
  )
);
