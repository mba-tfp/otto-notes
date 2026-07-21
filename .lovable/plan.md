# Offline Detection (Desktop App)

Show users when they've lost internet, since Otto Notes desktop requires a connection. Gated to the desktop app only (reuses the existing Electron / `otto-force-desktop` flag).

## Behavior

- **Persistent top banner** appears the moment the connection drops.
  - Red background, WiFi-off icon, message: "You're offline. Otto Notes needs an internet connection to work."
  - Small "Retry" link on the right that re-checks connectivity.
  - Not dismissible (offline is a real blocker).
- **Inline toasts** when the user tries an action that needs the network while offline:
  - Triggers: starting a recording, generating a note, sending a letter, saving a session, opening AI Assistant, searching physicians.
  - Toast copy: "You're offline. Please reconnect to [action]."
- **Auto-dismiss on reconnect**: banner disappears automatically and a green success toast "Back online" appears.

## Implementation

1. **`src/hooks/useOnlineStatus.ts`** (new)
   - Listens to `window` `online` / `offline` events plus an initial `navigator.onLine` check.
   - Gated to desktop: returns `online: true` always when not in desktop context (same `isDesktop` check as `useAppUpdateAvailable`).
   - Exposes `{ isOnline, isDesktop, retry() }` where `retry()` pings a lightweight endpoint (e.g. `HEAD` on the app origin) to force a re-check.
   - Tracks previous state to fire the "Back online" toast only on transitions (not on initial mount).

2. **`src/components/updates/OfflineBanner.tsx`** (new)
   - Red banner (`bg-destructive/10 border-destructive/30 text-destructive`), WiFi-off icon, message, Retry button.
   - Renders only when `isDesktop && !isOnline`.

3. **`src/components/layout/AppLayout.tsx`**
   - Mount `<OfflineBanner />` at the top of the layout (above the main content, similar to where the removed update banner sat).

4. **`src/lib/requireOnline.ts`** (new)
   - Small helper `requireOnline(actionLabel: string): boolean` — if offline, fires an error toast via `showErrorToast` and returns `false`; otherwise returns `true`.
   - Wire into the key action handlers: `handleToggleRecording` and `handleGenerate` in `NewSession.tsx`, letter send handler, AI submit, physician search trigger.

## Out of scope

- Actual queueing / offline persistence of work.
- Full-screen block or route gating.
- Web app offline UI.