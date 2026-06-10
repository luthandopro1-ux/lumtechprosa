
CREATE POLICY "Users manage own uploads - select" ON storage.objects FOR SELECT
USING (bucket_id = 'user-uploads' AND (auth.uid()::text = split_part(name, '/', 1) OR public.has_role(auth.uid(), 'admin')));
CREATE POLICY "Users manage own uploads - insert" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'user-uploads' AND auth.uid()::text = split_part(name, '/', 1));
CREATE POLICY "Users manage own uploads - delete" ON storage.objects FOR DELETE
USING (bucket_id = 'user-uploads' AND (auth.uid()::text = split_part(name, '/', 1) OR public.has_role(auth.uid(), 'admin')));
