## Goal
Replace the top banner and sidebar pill with two subtler surfaces: a launch-time corner toast and a chip in the existing AppFooter. Both open the same relaunch confirmation dialog we already built.

## Changes

### 1. Remove old surfaces
- `src/components/layout/AppLayout.tsx` — remove `<UpdateAvailableBanner />` mount and its import.
- `src/components/settings/LeftPane.tsx` — remove the "Update available" pill block, the `useAppUpdateAvailable` hook usage, the `RelaunchConfirmDialog` mount, `Sparkles` import, and the `relaunchDialogOpen` state.
- `src/components/updates/UpdateAvailableBanner.tsx` — delete file.

### 2. Corner toast (reappears each session)
- New component `src/components/updates/UpdateAvailableToast.tsx` mounted once in `AppLayout`.
- On mount, if the hook reports `updateAvailable` AND `sessionStorage.otto-update-toast-shown !== 'true'`, fire a persistent sonner toast at bottom-right:
  - Icon: `Sparkles`, title "New version ready", description "Relaunch Otto Notes to install the latest update."
  - Action button: "Relaunch" (opens the RelaunchConfirmDialog).
  - Cancel button: "Later" (dismisses the toast for the session).
  - `duration: Infinity` so it stays until the user acts; `id: 'otto-update'` to avoid duplicates.
- After showing, set `sessionStorage.otto-update-toast-shown = 'true'` so it doesn't re-fire on route changes. It reappears next session (new tab / relaunch) because sessionStorage is cleared.
- Component owns the dialog state so the action button can open the confirm dialog.

### 3. AppFooter chip (always visible, quiet)
- Edit `src/components/layout/AppFooter.tsx`.
- When `updateAvailable` is true, insert a chip between the left copyright block and the right language block (or at the far right of the left block):
  - Style: small rounded-full pill, `bg-primary/10 text-primary` border `border-primary/20`, height ~22px.
  - Content: small green pulse dot + text "Update ready \u00b7 Relaunch".
  - Clicking opens the same `RelaunchConfirmDialog`.
  - Hidden entirely when no update is available (no layout shift risk — footer already flex-justify-between).
- Footer owns its own dialog state.

### 4. Shared bits (already exist, unchanged)
- `useAppUpdateAvailable` hook — reused as-is (still stubbed, still gated to Electron / `otto-force-desktop`).
- `RelaunchConfirmDialog` — reused as-is by both new surfaces.

## Behavior recap
- Desktop app launch: subtle bottom-right toast appears once per session with a "Relaunch" action.
- If dismissed, the footer chip remains as a permanent quiet reminder until relaunched.
- On confirm, `applyUpdate()` clears the flag and both surfaces disappear.

## Out of scope
- Real electron-updater wiring (still UI-only).
- Any other placements (avatar badge, settings entry).