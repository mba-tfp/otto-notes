
# Settings responsive fix

The Settings page renders a fixed `w-75` category nav (`MiddlePane`) permanently beside the content pane (`RightPane`). Below `xl` the two-pane layout crowds the form; below `md` the nav eats the screen and every form row uses `grid-cols-3` with no responsive variants, so fields overflow horizontally.

## Changes

### 1. `MiddlePane.tsx` — responsive nav

- **Desktop (`xl+`)**: unchanged — vertical rail, `w-75`.
- **Tablet (`md–xl`)**: narrow vertical rail, `w-56`, icons + labels.
- **Mobile (`<md`)**: turn into a horizontal scrolling pill bar at the top of the content area instead of a side column.
- Drop `h-screen` → `h-full` (fixes overflow inside AppLayout's mobile top bar).

### 2. `Settings.tsx` layout

- Desktop/tablet: `flex-row` — MiddlePane beside RightPane (current).
- Mobile: `flex-col` — MiddlePane (horizontal pill bar) stacked above RightPane.
- Sessions-panel swap logic (when `isSessionsPanelVisible`) still applies at desktop only; on mobile/tablet the sessions panel already opens as a Sheet from AppLayout, so Settings just renders its own middle pane.

### 3. `RightPane.tsx` — responsive padding

- `px-8 py-8` → `px-4 py-6 md:px-6 md:py-8`
- Keep `max-w-[1100px] mx-auto` centering intact.

### 4. `ProfileSettings.tsx` — grid responsiveness

- Row 1 (Title / First / Last): `grid-cols-1 sm:grid-cols-[120px_1fr_1fr]`
- Row 2 (Phone / Specialty / Role): `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Row 3 (Clinic / Location / Language): same as Row 2
- Save/Cancel row: add `flex-wrap`

### 5. Other settings tabs (`SecuritySettings`, `AISettings`, `PrivacySettings`, `SignatureSettings`, `UserManagement`)

Quick audit — I'll open each and apply the same rule: any `grid-cols-2`/`grid-cols-3` without a responsive prefix becomes `grid-cols-1 md:grid-cols-N`. Any fixed `max-w-*` that exceeds mobile width gets a `w-full` fallback. No visual/token changes.

## Files touched

```text
src/pages/Settings.tsx
src/components/settings/MiddlePane.tsx
src/components/settings/RightPane.tsx
src/components/settings/ProfileSettings.tsx
src/components/settings/SecuritySettings.tsx        (audit + fix if needed)
src/components/settings/AISettings.tsx              (audit + fix if needed)
src/components/settings/PrivacySettings.tsx         (audit + fix if needed)
src/components/settings/SignatureSettings.tsx       (audit + fix if needed)
src/components/settings/UserManagement/index.tsx    (audit + fix if needed)
```

Zero design-token / color changes. Zero backend changes.

## Verification

- 375px: horizontal pill bar of categories at top, form fields stack vertically, no horizontal scroll.
- 900px (tablet): narrow left rail (~224px), form fields in 2 columns.
- 1440px (desktop): unchanged from current.

Approve and I'll implement.
