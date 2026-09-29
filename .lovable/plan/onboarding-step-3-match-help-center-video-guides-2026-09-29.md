# Onboarding Step 3 — Match Help Center Video Guides

## Goal
Update the first-login onboarding modal's Step 3 ("Training & Resources") so its videos and text match the 5 video guides in the Help Center, instead of the current 3 hardcoded placeholder videos.

## Changes

### 1. `src/components/onboarding/OnboardingStepThree.tsx`
- Replace the hardcoded `TRAINING_VIDEOS` array (3 items) with the 5 Getting Started video guides, sourced from `src/data/resourceCenter.ts` (single source of truth — import `topics` and filter `categoryId === 'getting-started'`):
  1. Generating a note in Otto notes (6:15)
  2. Manage and create templates (4:12)
  3. Letters workflow (3:24)
  4. Template hub (2:48)
  5. Settings in Otto notes (5:06)
- Each card shows: title, description (from the Help Center data), duration badge, and the topic's icon.
- Clicking a card opens a video player dialog with the embedded Vimeo iframe (using each topic's `videoUrl`, already in `player.vimeo.com` embed format) and the guide's step-by-step text below the video.
- Layout: switch the 3-column grid to a scrollable list/grid that fits 5 cards within the modal's `max-h-[90vh]` constraint.
- Keep the "Book a 1-on-1 demo" calendar picker and the "I don't need training" opt-out unchanged.

### 2. No data changes
- `src/data/resourceCenter.ts` already holds the titles, descriptions, durations, and Vimeo URLs — the onboarding modal will import from it so Help Center and onboarding stay in sync.

## Technical notes
- Reuse the existing `Dialog` + iframe embed pattern; Vimeo embeds use `https://player.vimeo.com/video/<id>?h=<hash>`.
- `TrainingBanner` reuses `OnboardingStepThree`, so the nudge banner dialog gets the same 5 videos automatically.
- Modal stays `max-w-2xl` on step 3; video list scrolls inside the existing modal scroll area.
