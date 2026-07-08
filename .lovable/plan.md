# Fix GP Letter preview formatting and footer overlap

Two distinct bugs in the Note panel (`src/components/newSession/RightColumnPanel.tsx`).

## Bug 1 — Letter formatting collapses

The GP Letter template seeds `activeTab.content` as **plain text** with blank-line paragraph separators (`\n\n`).

- In edit mode, Tiptap's `setContent(plainText)` treats it as HTML, so every `\n` is lost and the entire letter becomes one giant paragraph. When the user toggles back to Preview, the stored HTML is one `<p>` with the whole letter, which is what the screenshot shows.
- In preview mode, we render via `dangerouslySetInnerHTML`, so plain-text content with `\n` also collapses.
- The blue-ish tint comes from the `prose` class which restyles the text; not needed here.

**Fix:**
- Add a small helper `toEditorHtml(content)` that, if `content` contains no HTML tags, splits on blank lines and wraps each block in `<p>` (single `\n` becomes `<br/>`). Otherwise return as-is.
- Use that helper when seeding/syncing Tiptap content (`setContent`) so paragraph structure is preserved on first load and on tab switches.
- Use the same helper when rendering preview via `dangerouslySetInnerHTML`.
- Drop the `prose prose-sm` class on the preview wrapper; keep `text-foreground` + `whitespace-normal` so the body uses the app's normal typography.

## Bug 2 — Reviewed / Send to Letters footer overlaps content

Current structure inside the Note panel:

```text
<div className="flex-1 overflow-auto">       ← scroll container
  <div className="flex flex-col h-full p-4">  ← forced to parent height
    <editor flex-1 min-h-[300px] />            ← content overflows the box
    <footer mt-4 pt-4 border-t />              ← gets covered by overflow
  </div>
</div>
```

Because the inner column is `h-full`, the editor is a fixed-height flex child but its ProseMirror text grows past it. The overflow visually paints on top of the footer, producing the overlap in the screenshot.

**Fix:** lift the footer out of the scroll area and pin it to the bottom of the Note panel.

- Restructure the Note panel as:
  ```text
  <div className="flex flex-col h-full">
    <div className="flex-1 overflow-auto p-4">   ← only the content scrolls
      <editor / preview>
    </div>
    <div className="shrink-0 border-t border-border bg-background px-4 py-3 flex items-center gap-3">
      Review disclaimer + Reviewed / Send to Letters buttons
    </div>
  </div>
  ```
- Remove `h-full` from the inner column and the `mt-4 pt-4 border-t` from the footer (replaced by the pinned container's `border-t`).
- Keep the existing conditional that hides the action buttons until `hasGeneratedContent`, and keep the existing `existingLetter` Sent badge branch.
- Keep the disclaimer visible at all times (matches today's behaviour).

## Files touched

- `src/components/newSession/RightColumnPanel.tsx` — add `toEditorHtml` helper, use it in the Tiptap sync `useEffect` and in the preview render, restructure the Note panel JSX to pin the footer.

No other files, no schema, no new dependencies.
