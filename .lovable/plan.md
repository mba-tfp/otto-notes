
# Responsive Refactor for Desktop + Web

Goal: make Otto Notes work cleanly at every width from ~360px (mobile) up to large desktop, so packaging as an Electron desktop app (any window size) doesn't break the UI. This is a systematic refactor, not a redesign — visuals, tokens, and brand stay identical.

## Scope

**In scope (must be responsive):**
- New Session (`/new-session`)
- View Sessions (`/sessions`)
- Letters (`/letters`)
- Settings (`/settings`)
- Template Hub + My Templates
- Sidebar / global layout / footer
- Onboarding modals, consent dialog, all shared modals
- Global toast, tooltips, popovers

**Out of scope (skipped per your call):**
- AI Assistant
- What's New (`/whats-new`)
- Resource / Help Center
- Team

Those routes keep their current desktop-only layout and get a min-width guard with a "best viewed on desktop" note.

## Breakpoint System

Adopt three canonical breakpoints (Tailwind defaults, no config change):

| Name | Width | Layout |
|---|---|---|
| Mobile | `<768px` (`< md`) | Single pane, sidebar becomes drawer (Sheet), middle pane becomes route |
| Tablet | `768–1279px` (`md → xl`) | Two panes: sidebar (collapsed to icons by default) + main. Middle pane opens as overlay/drawer |
| Desktop | `≥1280px` (`xl+`) | Current three-pane layout unchanged |

One rule everywhere: **no fixed pixel widths except the sidebar icon strip.** The 320px middle-pane rule stays *only* at desktop; below xl it collapses.

## Architecture Changes

### 1. AppLayout (`src/components/layout/AppLayout.tsx`)
- Wrap in a `useIsMobile` + new `useBreakpoint` hook (`mobile | tablet | desktop`).
- Desktop: current 3-pane behavior.
- Tablet: sidebar auto-collapses to icon rail; GlobalSessionsPanel becomes a slide-in `Sheet` triggered from the header.
- Mobile: sidebar becomes a `Sheet` (hamburger in a new top bar); GlobalSessionsPanel becomes a full route push, not a pane.

### 2. Sidebar (`LeftPane.tsx`)
- Below `md`, render inside a `Sheet` opened by a hamburger button in a new mobile top bar.
- At `md–xl`, default to collapsed icon rail; expand on hover/click.
- Keep desktop behavior identical at `xl+`.

### 3. New Session (`NewSession.tsx` + `TwoColumnLayout.tsx`)
Highest-risk screen. Changes:
- `SessionHeaderRow`: wrap fields in `flex-wrap`, stack vertically below `md`.
- `SessionInfoBar`: collapse secondary controls into an overflow menu below `md`.
- `TwoColumnLayout`:
  - Desktop (`xl+`): current resizable two-column.
  - Tablet: two columns but non-resizable, 50/50, min-widths removed.
  - Mobile: `Tabs` — "Transcript / Dictation" and "Context / Note" as two tabs, single column.
- Editor footer (Reviewed / Send to Letters): already fixed to scroll with content; verify on narrow widths that buttons wrap instead of overflowing.
- Bottom "Review your note" banner: allow wrap.

### 4. View Sessions, Letters
- Middle list pane → full width on mobile; detail pane opens as pushed route (`/sessions/:id`, `/letters/:id`).
- Toolbar (search + filters + action): collapse filters into a "Filters" button that opens a `Sheet` below `md`.
- Cards: reduce padding, allow metadata to wrap, hide non-critical badges below `sm`.

### 5. Settings
- Left tab list → horizontal scrolling tabs on mobile, vertical rail on tablet+, current layout on desktop.
- Two-column grids in Profile → single column below `md`.

### 6. Templates (Hub + My Templates)
- Table → card grid below `md`.
- Filter dropdowns → full-width in a `Sheet` below `md`.

### 7. Modals & Dialogs
Audit every `DialogContent` for:
- `max-w-*` that exceeds viewport → add `w-[95vw]` fallback.
- Fixed grids → `grid-cols-1 md:grid-cols-2`.
- Footer buttons → `flex-wrap` + full-width on mobile.
Includes: onboarding steps, consent dialog, restart dialog, patient create/edit, template create, send-to-letters, etc.

### 8. Footer (`AppFooter.tsx`)
- Hide non-essential items below `md`; keep only status + shortcut hint.

### 9. Out-of-scope routes (AI Assistant, What's New, Help Center, Team)
- Wrap page root in a min-width container (`min-w-[1024px] overflow-x-auto`) so they never visually break; they just require horizontal scroll on narrow windows. No layout work.

## Desktop App Packaging (Electron)

After responsive work lands:
- Set Electron `BrowserWindow` `minWidth: 800`, `minHeight: 600`, default `1400x900`.
- Set `base: './'` in `vite.config.ts` for `file://` loading.
- Package with `@electron/packager` (per sandbox constraints).
- Add a small `useIsElectron` helper in case any UI needs to hide web-only affordances.

Electron packaging happens *after* the responsive refactor is verified, not before — otherwise we ship a broken desktop app.

## Execution Order

```text
Phase 1  Foundation
  - useBreakpoint hook, AppLayout responsive shell, sidebar Sheet mode
  - Mobile top bar with hamburger

Phase 2  Primary flows
  - New Session responsive (highest risk)
  - View Sessions list/detail routing
  - Letters list/detail routing

Phase 3  Secondary
  - Settings, Templates, all modals audit
  - Footer, tooltips, popovers on mobile

Phase 4  Guardrails
  - Min-width wrapper on out-of-scope routes
  - QA pass at 375 / 768 / 1024 / 1280 / 1600 widths

Phase 5  Electron
  - Add Electron main process, packaging config, build script
```

Each phase is independently shippable — you can approve/pause between phases.

## Technical Notes

- No new dependencies for the responsive work (Tailwind + existing shadcn Sheet/Tabs/Drawer cover everything).
- Zero changes to design tokens, colors, fonts, or brand rules in memory.
- Zero backend / schema changes.
- Existing memory rules (320px middle pane, 3-pane layout, focus rings, etc.) remain **desktop-only** rules — I'll update memory to reflect that scoping when the refactor lands.
- Routes for detail views (`/sessions/:id`, `/letters/:id`) will be added; existing in-pane detail continues to work at desktop widths.

## What I need from you

Approve this plan, or tell me to reorder phases (e.g. "do Electron first with a min-window guard, refactor later" is a valid alternate path if you want a shippable desktop build this week).
