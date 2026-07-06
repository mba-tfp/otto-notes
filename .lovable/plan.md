
# Drafts skip the detail pane in /sessions

## Behavior

- Click a **draft** session card in `/sessions` → immediately navigate to `/new-session?id=<session.id>` to keep editing. Detail pane is never shown for drafts.
- Click a **completed** session card → open the detail pane as it does today (that pane is now correctly wired via Phase 2).
- The pre-existing "Continue editing" empty state in `SessionDetail` becomes unreachable and is removed to keep the file clean.

## Files

**`src/pages/ViewSessions.tsx`**
- Replace the `onSessionSelect={setSelectedSessionId}` handler with a wrapper that looks up the session:
  - If `session.status === 'draft'` (or `'empty'`) → `navigate('/new-session?id=' + id)` and do NOT set `selectedSessionId`.
  - Otherwise → `setSelectedSessionId(id)` as before.
- Uses `useSessions().getSession` + `useNavigate()`.

**`src/components/sessions/SessionDetail.tsx`**
- Delete the empty-state block (lines ~216–232: the `!hasContent` branch with `ArrowUpRight` + "Continue editing"). No other logic changes.
- Remove the `ArrowUpRight` import if it becomes unused.

## Out of scope

- No changes to `SessionList`, cards, filters, or mobile back-button flow from Phase 2.
- No changes to how Letters routes selections.
- No visual redesign of the completed-session detail pane.
