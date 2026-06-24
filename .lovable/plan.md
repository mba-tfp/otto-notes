## Note tab: read-only preview by default with Edit → Save toggle

Mirror the existing Otto Notes pattern (per screenshots): the Note tab opens in a read-only preview; an **Edit** button switches to a rich editing mode; a **Save** button commits changes and returns to preview.

### Scope
Single file: `src/components/newSession/NoteTab.tsx`. No backend or business-logic changes. No new types.

### Behavior
- **Default mode = Preview** whenever an active tab has content. Switching tabs or generating a new note returns the tab to Preview.
- **Preview mode**
  - Renders `activeTab.content` as read-only formatted text (same typography as today's textarea, but non-editable — a `div` with `whitespace-pre-wrap`).
  - Toolbar shows: template dropdown, More menu, language selector, **Edit** button (pencil icon + "Edit"), refresh/regenerate, Copy, language globe (matches screenshot 1).
  - Undo/Redo hidden in preview mode.
- **Edit mode**
  - Renders the existing `<Textarea>` bound to `updateTabContent`, autofocused.
  - Toolbar swaps the Edit button for a primary **Save** button (salmon/primary, save icon + "Save") plus a secondary **Preview** button (matches screenshot 2). Undo/Redo become visible in this mode.
  - Save: persists current textarea content (already live via `updateTabContent`), shows a toast ("Note saved"), and returns the tab to Preview mode. Cancel/Preview button returns to Preview without extra confirmation (changes are already in state — matches existing auto-persist behavior; no destructive discard implied).
- **Empty state** (no content yet): no Edit/Save buttons shown; template picker + warning behaves as today.
- **Per-tab mode**: track `mode: 'preview' | 'edit'` per `activeTabId` in a `Record<string, 'preview' | 'edit'>` state (alongside existing `tabStates`). New tabs start in `preview`. When `onGenerate` completes and content arrives, the tab resets to `preview` (handled by defaulting unknown tab ids to `preview`).

### UI details
- Edit button: `<Button variant="ghost" size="sm">` with `Pencil` icon + label "Edit", placed in the right-side action cluster before Copy.
- Save button: `<Button size="sm" className="gap-2">` with `Save` icon + label "Save", primary styling (uses existing `bg-primary` salmon by default).
- Preview button (visible only in edit mode): `<Button variant="ghost" size="sm">` with `Eye` icon + "Preview".
- Read-only renderer: `<div className="flex-1 min-h-[300px] text-base leading-relaxed whitespace-pre-wrap text-foreground">{activeTab.content}</div>`.
- Keep all existing letter actions, disclaimer banner, and SendToLettersDialog untouched.

### Out of scope
- No rich-text/Tiptap conversion (Letter detail uses Tiptap; Note tab stays plain text for now).
- No keyboard shortcut for Edit/Save (Ctrl+S already mapped elsewhere — unchanged).
- No autosave-on-blur. No dirty-state confirmation prompts.
