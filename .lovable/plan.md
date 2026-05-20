## Add category filter to Import Documents modal

Add a category filter to `CnpDocumentsPickerModal` so users can narrow the document list to one of four fixed categories.

### Categories (fixed set)
1. Previous Test Results
2. Health History Form
3. Medical Records
4. Diagnostic Testing

### UX
- Render a row of filter pills directly under the "From Otto Onboard" subtitle, above the patient/partner sections.
- Pills: "All" + the 4 categories. Single-select, default "All".
- Follow the existing **Filter Pill Design System** (rounded-full, white bg, active = brand highlight).
- Show a small count badge next to each pill reflecting available docs in that category across both owners (optional, only if it fits cleanly).
- When a filter is active:
  - Hide documents that don't match.
  - Hide a patient/partner section entirely if it has zero matching docs (avoid empty headers).
  - "Select all" per section operates only on currently visible (matching, non-imported) docs.
- Selections already made in other categories persist when switching filters (don't clear `selected` set on filter change). The footer count keeps reflecting total selected.
- Empty state: if no docs match across both sections, show a centered muted "No documents in this category" message inside the body.

### Data
- Extend the demo seed in `src/data/demoCnpDocuments.ts` so the GA demo patient has at least one doc in each of the 4 categories (currently only Medical Records + Previous Test Results + Health Card exist). Rename the "Health Card" entry's category to one of the 4 allowed values or replace it, and add a Diagnostic Testing entry and a Health History Form entry for both patient and partner so the filter has something to show.
- Normalize category values to the 4 canonical strings.

### Files
- `src/components/newSession/CnpDocumentsPickerModal.tsx` — add filter state, pill row, filtering logic, empty state.
- `src/data/demoCnpDocuments.ts` — align/seed the 4 categories.

### Out of scope
- No backend/category management UI.
- No multi-select filter, no search input (single-select pills only, per request).
