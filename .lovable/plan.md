## Goal
Add a UI-only "Relaunch to update" prompt that simulates the desktop app detecting a new version via version-endpoint polling. Shown in two places at once: a persistent top banner and a subtle sidebar footer pill. Clicking either opens a confirmation dialog before "relaunching".

## Behavior
- A lightweight hook `useAppUpdateAvailable` polls a version manifest (e.g. `/version.json`) every N minutes and compares to the app's current version. For the UI-only phase, it returns a mockable boolean driven by:
  - `localStorage.otto-mock-update-available === 'true'` (dev toggle), OR
  - a hardcoded stub returning `true` so the UI is visible to design.
- Only surfaces when running in the desktop app. Detected via `navigator.userAgent.includes('Electron')` OR `localStorage.otto-force-desktop === 'true'` for preview testing. In the browser preview the prompts stay hidden unless the force flag is set.
- Dismissal: banner has a close (X) that hides it for the current session only (sessionStorage). Sidebar pill stays visible until the update is "applied".

## UI

1. **Persistent top banner** (`src/components/updates/UpdateAvailableBanner.tsx`, new)
   - Full-width strip above main content, mounted in `AppLayout`.
   - Left: small sparkle/download icon + text: "A new version of Otto Notes is available."
   - Right: primary button "Relaunch to update" (Salmon `bg-primary`) + ghost X to dismiss for session.
   - Subtle salmon-tinted background (`bg-primary/10`, `border-b border-primary/20`), 40px tall, matches existing banner styling patterns (TrainingBanner / FeedbackNudgeBanner).

2. **Sidebar footer pill** (inside `LeftPane.tsx` footer list)
   - New footer item "Update available" with a small green dot indicator.
   - Sits above "Get desktop app" so it's the first thing users notice.
   - Collapsed sidebar: shows just the icon with a green dot; tooltip reads "Update available — click to relaunch".
   - Clicking opens the same confirmation dialog as the banner button.

3. **Confirmation dialog** (`src/components/updates/RelaunchConfirmDialog.tsx`, new)
   - Standard shadcn Dialog following the app's modal layout spec.
   - Title: "Relaunch to update?"
   - Body: "Otto Notes will close and reopen to install the latest version. Any unsaved work in the current session may be lost."
   - Footer: "Cancel" (ghost) + "Relaunch now" (Salmon primary).
   - On confirm (UI-only): show success toast "Relaunching…", clear the update-available flag, close dialog. No actual quit call.

## Files

- `src/hooks/useAppUpdateAvailable.ts` (new) — polling stub + isDesktop detection + dismissal state.
- `src/components/updates/UpdateAvailableBanner.tsx` (new)
- `src/components/updates/RelaunchConfirmDialog.tsx` (new)
- `src/components/layout/AppLayout.tsx` (edit) — mount banner above the main content region.
- `src/components/settings/LeftPane.tsx` (edit) — add "Update available" footer item with green dot, wire click to open the dialog. Keep existing "Get desktop app" hover card untouched.

## Out of scope
- Real electron-updater / IPC wiring (deferred to Electron integration phase).
- Actual version manifest endpoint (stubbed).
- Deferring relaunch until session ends.

Ready to build on approval.