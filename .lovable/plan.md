## Goal
Make the Otto Notes web app render cleanly at a minimum viewport of **1320 × 800 px** without horizontal scroll, content clipping, or footer/toolbar overlap — while preserving the existing 3-pane layout and design system.

## Approach
Audit fixed-width and fixed-height assumptions across the shell (sidebar, middle pane, right pane, footer, modals) and tighten spacing / make secondary chrome flex so the primary content always fits.

## Scope of changes

### 1. Global shell fit (1320 wide)
At 1320px, the horizontal budget is:
- Sidebar (expanded ~240px) + Middle pane (320px fixed) + Right pane = 1320
- Right pane ends up ~760px — too tight for current padding on some pages.

Adjustments (frontend/presentation only):
- `AppLayout` root: keep `overflow-hidden`; ensure right column uses `min-w-0` so flex children can shrink.
- Right-pane page wrappers (`MyTemplates`, `TemplateHub`, `Settings`, etc.) currently use `px-10 lg:px-14 py-10 max-w-7xl` — reduce to `px-6 xl:px-10 py-6` so content breathes at 1320.
- Pages that stack Global Sessions Panel (320) + secondary list (320) + detail (Letters, WhatsNew, AIAssistant): when both are visible at 1320, detail collapses. Add `min-w-0` on detail wrappers; verify secondary list only renders when sessions panel hidden (already the case) — no logic change.

### 2. Vertical fit (800 tall)
- `AppFooter` height + `TrainingBanner` / `FeedbackNudgeBanner` must not eat into content. Confirm footer uses fixed compact height; if banners are absolute-positioned overlays, no change. If they push layout, cap their height and make dismissible content scroll inside.
- Modals already use `max-h-[90vh]` (memory rule) → at 800px = 720px available; verify Create Template / Onboarding / Consent modals scroll their bodies (per Standardized Modal Layout memory).
- New Session two-column layout: `TwoColumnLayout` uses `ResizablePanelGroup` filling `h-full` — fine. Recording controls bar + session header stack: measure combined height, ensure transcript/note panels get `flex-1 min-h-0`.

### 3. Sidebar behavior
- `LeftPane` expanded width likely ~240–256px. At 1320px total, this is fine. No forced collapse. Verify collapse toggle still works; no change to sidebar collapse spec.

### 4. Typography / spacing tuning
- Reduce oversized `py-10` / `px-14` page paddings on right-pane routes to `py-6 px-6 xl:px-10`.
- Toolbar rows (Templates, Sessions, Letters) already use standardized pattern — verify they wrap or truncate at 760px right-pane width; add `min-w-0` + `truncate` where filter pills currently cause horizontal overflow.
- Session cards and Letter cards inside the 320px middle pane already tested; no change.

### 5. Explicit minimum
- Add a min-width safety net on `#root` / `body`: `min-w-[1320px]` is NOT desired (would create horizontal scroll below that). Instead, treat 1320 as the design floor and let layout gracefully degrade below via existing `overflow-hidden` — no viewport meta or media-query breakpoint added.
- Do NOT introduce mobile/tablet responsive breakpoints — this app remains desktop-only per existing architecture.

## Files to touch (presentation only)
- `src/components/layout/AppLayout.tsx` — ensure `min-w-0` on right column
- `src/pages/MyTemplates.tsx`, `src/pages/TemplateHub.tsx`, `src/pages/Settings.tsx`, `src/pages/Team.tsx`, `src/pages/ResourceCenter.tsx`, `src/pages/WhatsNew.tsx`, `src/pages/Letters.tsx`, `src/pages/AIAssistant.tsx`, `src/pages/ViewSessions.tsx`, `src/pages/NewSession.tsx` — tighten wrapper padding & add `min-w-0` on detail panes
- `src/components/newSession/TwoColumnLayout.tsx` — ensure panels use `min-w-0 min-h-0`
- Toolbar components under `src/components/templates/`, `src/components/sessions/`, `src/components/letters/` — add `flex-wrap` / `min-w-0` where filters overflow at ~760px
- `src/components/layout/AppFooter.tsx` — verify compact height (no change unless tall)

## Out of scope
- No new breakpoints, no mobile support, no business logic changes, no schema, no new dependencies.
- No changes to the 320px middle-pane rule, sidebar collapse spec, modal spec, or brand tokens.

## Verification
1. Set preview viewport to 1320×800.
2. Visit each route: New Session, View Sessions, Letters, Templates, Template Hub, Settings, Team, AI Assistant, Resource Center, What's New.
3. Confirm: no horizontal scroll, footer visible, toolbars fit, right-pane content readable, modals scroll internally.
4. Playwright screenshot pass at 1320×800 for the routes above.
