CREATE TABLE public.user_training_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  completed_video_ids text[] NOT NULL DEFAULT '{}'::text[],
  legacy_prompt_seen boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_training_progress TO authenticated;
GRANT ALL ON public.user_training_progress TO service_role;

ALTER TABLE public.user_training_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own training progress"
ON public.user_training_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own training progress"
ON public.user_training_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own training progress"
ON public.user_training_progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own training progress"
ON public.user_training_progress
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE TRIGGER update_user_training_progress_updated_at
BEFORE UPDATE ON public.user_training_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_team_member_updated_at();