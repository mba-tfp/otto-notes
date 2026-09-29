# Two-flow training rollout

## Goal
Give new users training during onboarding, while asking existing users once about prior training and keeping a subtle Help Center reminder until every required video is marked complete.

## Flow 1: New users
- Keep the approved three-step onboarding: profile, signature, then Training & Resources.
- Add an explicit **Mark complete** control to each training video in Step 3 and show its completed state.
- Let users continue or skip without forcing completion.
- If any required video remains incomplete, show the salmon notification dot on Help Center. Skipping also keeps the existing five-minute reminder banner behavior.
- Remove the dot automatically once all current training videos are marked complete.

## Flow 2: Existing users
- On the first sign-in after rollout, show one concise prompt:
  - **Title:** “Have you completed Otto Notes training?”
  - **Primary:** “Yes, I’ve completed it”
  - **Secondary:** “Not yet — show me the training”
- “Yes” marks all current videos complete and prevents the Help Center dot.
- “Not yet” opens Getting Started and shows the dot until every video is manually marked complete.
- Closing the prompt records that it was shown, treats training as incomplete, and shows the dot without asking again.

## Help Center indication
- Add a small salmon notification dot to the Help Center item in the left sidebar.
- In the expanded sidebar, place it beside the Help Center label; in collapsed mode, anchor it to the book icon.
- Keep it visible across pages while training is incomplete; opening Help Center alone does not clear it.
- In Getting Started, show completion controls and completed styling on every video card.
- Documents, including the SOP, do not count toward video-training completion.

## Durable progress
- Store completion per signed-in user in the app database so it follows them across browsers and devices.
- Seed existing accounts as the legacy cohort requiring the one-time prompt; accounts created after rollout use the new-user flow.
- Store completed guide IDs rather than one global boolean. Adding either of the two planned videos later will make the dot return until that new guide is marked complete.
- Protect progress so users can only read and update their own record.

## Technical details
- Add a dedicated training-progress table with explicit authenticated/service grants and strict row-level access policies.
- Centralize required-video IDs and training status in a shared hook/provider used by onboarding, Help Center, the sidebar dot, and the reminder banner.
- Preserve the current accordion animation, modal sizing, Help Center layout, and five-minute skip reminder.
- Verify both cohorts, prompt dismissal, manual completion, new-video behavior, expanded/collapsed sidebar dots, persistence after reload, and the 1320×800 onboarding layout.
