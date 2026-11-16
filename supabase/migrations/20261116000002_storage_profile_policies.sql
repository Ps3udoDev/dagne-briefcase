-- Permite actualizar/reemplazar archivos en psicoiris-media (ej. carpeta profile/)
create policy "Authenticated update own files in psicoiris-media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'psicoiris-media' and auth.uid() = owner)
  with check (bucket_id = 'psicoiris-media');
