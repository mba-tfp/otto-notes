
DROP POLICY IF EXISTS "Anyone can view active physicians" ON public.referring_physicians;
CREATE POLICY "Authenticated users can view active physicians"
ON public.referring_physicians
FOR SELECT
TO authenticated
USING (active = true);

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.sync_user_role() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_team_member_updated_at() FROM PUBLIC, anon, authenticated;
