## Goal
Promote the new Otto Notes desktop app to logged-in users via a one-time, dismissible modal shown on first sight of the New Session screen, plus a permanent subtle entry point so users can find it again after dismissing.

## UX rationale
- New Session is the first screen after login → highest attention, ideal for a one-shot promo.
- Modal is high-impact but interrupts, so it must be shown only once (remembered), be easy to dismiss, and include a clear primary CTA "Download desktop app".
- After dismissal users still need discoverability → add a small, always-available "Download desktop app" entry in the sidebar footer (next to "What's New" / "Help Center"). This mirrors the existing footer pattern and doesn't add visual noise.

## Placement

1. **Primary — One-time modal on `/new-session`**
   - Triggers on mount if `localStorage.otto-desktop-promo-dismissed !== 'true'`.
   - Does NOT trigger during the new-user onboarding flow (waits until onboarding modal is closed) to avoid stacking modals.
   - Contents:
     - Otto logo + short headline: "Otto Notes is now on desktop"
     - 2–3 line value prop (faster, offline-friendly, native mic access)
     - Small product visual/illustration (placeholder allowed; user can swap later)
     - Primary CTA: "Download desktop app" (Salmon `bg-primary`) → opens download URL in new tab
     - Secondary: "Maybe later" (ghost) → dismisses & remembers
     - Close (X) in the top-right → dismisses & remembers
   - Style: reuses the standardized modal layout (Dialog, max-h-[90vh], flex-col header/body/footer) already used across the app.

2. **Secondary — Permanent sidebar footer entry**
   - New item in `LeftPane.tsx` footer list, above "What's New":
     - Icon: `Monitor` (or `Download`) from lucide-react
     - Label: "Get desktop app"
     - Behavior: opens download URL in new tab (same as Help Center pattern with `window.open(..., '_blank')`)
   - Respects collapsed/expanded sidebar states and tooltips, following existing footer item styling.
   - This is the fallback discovery point after users dismiss the modal.

## Files to change

- `src/components/onboarding/DesktopAppPromoModal.tsx` (new)
  - Self-contained Dialog. Reads/writes `localStorage.otto-desktop-promo-dismissed`. Waits for `NewUserOnboardingModal` completion (checks the same localStorage key that gates onboarding) before opening.
- `src/pages/NewSession.tsx`
  - Mount `<DesktopAppPromoModal />` at the page root so it only appears on the New Session screen.
- `src/components/settings/LeftPane.tsx`
  - Add "Get desktop app" entry to `footerItems` with `Monitor` icon, opens download URL in a new tab.
- (Optional) `src/assets/` — placeholder illustration for the modal; can be swapped later.

## Configuration
- Download URL: single constant `DESKTOP_APP_DOWNLOAD_URL` in the modal file (placeholder `#` until the real URL exists — user can update).
- Dismissal key: `otto-desktop-promo-dismissed` in `localStorage`. Once set to `'true'`, modal never re-opens.

## Out of scope
- Detecting whether the desktop app is already installed.
- OS detection / per-platform buttons (single CTA opens a download page that handles platforms).
- Role-based gating (all users see it, per your choice).

Ready to build on approval.