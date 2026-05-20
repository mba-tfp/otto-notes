## Switch category filter to a dropdown

Replace the pill row in `CnpDocumentsPickerModal` with a single Select dropdown.

### UX
- Place a compact `Select` (shadcn) on the right side of the body, above the document sections, aligned to the end of the row. Left side of the row stays empty (or shows a small "Filter" label).
- Options: "All categories" + the 4 fixed categories from `DEMO_CNP_CATEGORIES`.
- Default: "All categories".
- Trigger width ~220px, `h-9`, rounded-lg — matches existing Select styling.
- Keep the empty-state ("No documents in this category.") when the active filter yields zero docs.
- Remove the pill buttons and counts entirely.

### Files
- `src/components/newSession/CnpDocumentsPickerModal.tsx` — swap pill row for `<Select>`; keep existing filter state and logic.

### Out of scope
- No multi-select, no search, no changes to demo data.
