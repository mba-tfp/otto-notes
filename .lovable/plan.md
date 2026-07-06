
# Phase 2: Primary Flows Responsive Refactor

Make View Sessions, Letters, and their detail views work at mobile, tablet, and desktop widths — without breaking desktop behavior.

## 1. Routing changes

Add detail routes so mobile can push instead of split-pane:

- `/sessions` — list only (mobile), list + detail (desktop/tablet)
- `/sessions/:id` — detail (mobile pushes here; desktop/tablet updates URL but keeps split view)
- `/letters` — same pattern
- `/letters/:id` — same pattern

`SessionsLayoutContext` and `LettersContext` switch from local `selectedId` state to reading/writing the `:id` param via `useParams` + `useNavigate`. Selecting a card on mobile navigates; on desktop it just updates the URL and the detail pane re-renders.

## 2. View Sessions (`src/pages/ViewSessions.tsx`)

Behavior by breakpoint:

- **Desktop (`xl+`)**: unchanged — 320px `SessionList` + `SessionDetail` side-by-side.
- **Tablet (`md–xl`)**: same split, but list becomes `w-72` and detail gets `min-w-0` so it never overflows.
- **Mobile (`< md`)**:
  - `/sessions` renders `SessionList` full-width, no detail pane.
  - `/sessions/:id` renders `SessionDetail` full-width with a back button in its header that navigates to `/sessions`.
  - The Sessions Panel toggle in `AppLayout` still opens as a `Sheet` (already done in Phase 1).

## 3. Letters (`src/pages/Letters.tsx`)

Mirror the sessions pattern:

- Desktop: current split view unchanged.
- Tablet: list `w-72`, detail `min-w-0`.
- Mobile: `/letters` = list, `/letters/:id` = detail with back button.
- Same swap logic between `GlobalSessionsPanel` and `LettersList` still applies at desktop.

## 4. Toolbar collapse (list panes)

`SessionList` and `LettersList` toolbars today expose Search / Filter / Sort / Refresh inline. Below `md`:

- Keep Search icon (expands inline as today).
- Collapse Filter + Sort into a single "Filters" button that opens a `Sheet` from the right containing both the filter pills and the sort toggle.
- Refresh stays.

Desktop and tablet behavior unchanged.

## 5. Card layouts

`SessionCard` and `LetterCard`:

- Below `sm`: reduce internal padding from `p-3` to `p-2.5`, allow patient/template metadata rows to `flex-wrap`, hide the secondary status badge (keep only the primary one).
- Desktop unchanged.

No visual restyling — only wrap/hide rules.

## 6. Detail views

`SessionDetail` and `LetterDetail` header:

- Add a back-chevron button visible only below `md` that navigates to the parent list route.
- Ensure the header actions row uses `flex-wrap` so buttons stack instead of overflowing on narrow widths.
- Body content: replace any `max-w-*` that assumes desktop with `w-full max-w-none` on mobile.

The rich-text editor in `LetterDetail` gets `overflow-x-auto` on its content wrapper so long inline elements scroll rather than pushing layout.

## 7. What is NOT changing in Phase 2

- No changes to New Session (done in Phase 1).
- No changes to Settings/Templates (Phase 3).
- No modal audit yet (Phase 3).
- No design tokens, colors, spacing scale, or card visuals.
- Desktop three-pane rules remain intact.

## Files touched

```text
src/pages/ViewSessions.tsx
src/pages/Letters.tsx
src/App.tsx                                    (add /sessions/:id, /letters/:id routes)
src/contexts/SessionsLayoutContext.tsx         (URL-driven selection)
src/contexts/LettersContext.tsx                (URL-driven selection)
src/components/sessions/SessionList.tsx        (toolbar Sheet on mobile)
src/components/sessions/SessionDetail.tsx      (back button, wrap actions)
src/components/sessions/SessionCard.tsx        (wrap/hide rules)
src/components/letters/LettersList.tsx         (toolbar Sheet on mobile)
src/components/letters/LetterDetail.tsx        (back button, wrap actions, editor overflow)
src/components/letters/LetterCard.tsx          (wrap/hide rules)
```

## Verification

After implementation, resize the preview to 375 / 768 / 1024 / 1280 and confirm:
- List → detail navigation works on mobile with back button.
- Desktop split view is pixel-identical to current.
- Toolbar filter Sheet opens/closes on mobile.
- No horizontal scroll on the body at any width for these routes.

Approve to proceed, or tell me to adjust (e.g. skip the URL routing and use a `showDetail` state toggle instead — simpler but no deep-linking).
