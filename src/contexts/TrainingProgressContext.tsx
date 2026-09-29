import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { topics } from '@/data/resourceCenter';

const TRAINING_ROLLOUT_AT = new Date('2026-09-29T19:45:00Z');

interface TrainingProgressContextValue {
  completedVideoIds: string[];
  requiredVideoIds: string[];
  isComplete: boolean;
  needsTraining: boolean;
  isLoading: boolean;
  shouldAskLegacyUser: boolean;
  markVideoComplete: (videoId: string) => Promise<void>;
  markAllComplete: () => Promise<void>;
  acknowledgeLegacyPrompt: () => Promise<void>;
}

const TrainingProgressContext = createContext<TrainingProgressContextValue | undefined>(undefined);

export const TrainingProgressProvider = ({ children }: { children: ReactNode }) => {
  const requiredVideoIds = useMemo(
    () => topics.filter((topic) => topic.categoryId === 'getting-started' && topic.isVideo).map((topic) => topic.id),
    []
  );
  const [userId, setUserId] = useState<string | null>(null);
  const [completedVideoIds, setCompletedVideoIds] = useState<string[]>([]);
  const [legacyPromptSeen, setLegacyPromptSeen] = useState(true);
  const [isLegacyUser, setIsLegacyUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadProgress = async () => {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!active) return;

      if (!user) {
        setUserId(null);
        setCompletedVideoIds([]);
        setLegacyPromptSeen(true);
        setIsLegacyUser(false);
        setIsLoading(false);
        return;
      }

      setUserId(user.id);
      const [progressResult, profileResult] = await Promise.all([
        supabase
          .from('user_training_progress')
          .select('completed_video_ids, legacy_prompt_seen')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('user_profiles')
          .select('created_at')
          .eq('user_id', user.id)
          .maybeSingle(),
      ]);
      if (!active) return;

      const progress = progressResult.data;
      const profileCreatedAt = profileResult.data?.created_at;
      setCompletedVideoIds(progress?.completed_video_ids ?? []);
      setLegacyPromptSeen(progress?.legacy_prompt_seen ?? false);
      setIsLegacyUser(Boolean(profileCreatedAt && new Date(profileCreatedAt) < TRAINING_ROLLOUT_AT));
      setIsLoading(false);
    };

    void loadProgress();
    const { data: listener } = supabase.auth.onAuthStateChange(() => void loadProgress());
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const saveProgress = useCallback(async (ids: string[], promptSeen: boolean) => {
    setCompletedVideoIds(ids);
    setLegacyPromptSeen(promptSeen);
    if (!userId) return;

    const { error } = await supabase
      .from('user_training_progress')
      .upsert(
        { user_id: userId, completed_video_ids: ids, legacy_prompt_seen: promptSeen },
        { onConflict: 'user_id' }
      );
    if (error) throw error;
  }, [userId]);

  const markVideoComplete = useCallback(async (videoId: string) => {
    if (!requiredVideoIds.includes(videoId) || completedVideoIds.includes(videoId)) return;
    await saveProgress([...completedVideoIds, videoId], legacyPromptSeen);
  }, [completedVideoIds, legacyPromptSeen, requiredVideoIds, saveProgress]);

  const markAllComplete = useCallback(
    () => saveProgress(requiredVideoIds, true),
    [requiredVideoIds, saveProgress]
  );

  const acknowledgeLegacyPrompt = useCallback(
    () => saveProgress(completedVideoIds, true),
    [completedVideoIds, saveProgress]
  );

  const isComplete = requiredVideoIds.every((id) => completedVideoIds.includes(id));
  const value = useMemo<TrainingProgressContextValue>(() => ({
    completedVideoIds,
    requiredVideoIds,
    isComplete,
    needsTraining: Boolean(userId && !isComplete),
    isLoading,
    shouldAskLegacyUser: Boolean(userId && isLegacyUser && !legacyPromptSeen),
    markVideoComplete,
    markAllComplete,
    acknowledgeLegacyPrompt,
  }), [acknowledgeLegacyPrompt, completedVideoIds, isComplete, isLegacyUser, isLoading, legacyPromptSeen, markAllComplete, markVideoComplete, requiredVideoIds, userId]);

  return <TrainingProgressContext.Provider value={value}>{children}</TrainingProgressContext.Provider>;
};

export const useTrainingProgress = () => {
  const context = useContext(TrainingProgressContext);
  if (!context) throw new Error('useTrainingProgress must be used within TrainingProgressProvider');
  return context;
};