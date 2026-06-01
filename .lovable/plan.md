## Move category filter into per-person section headers

Replace the global filter pill row in `CnpDocumentsPickerModal` with a small category dropdown placed inline next to each person's name (patient and partner). Each dropdown filters only that person's document list independently.

### UX
- Remove the "All + 4 pills" row directly under the "From Otto Onboard" subtitle.
- In each section header row (currently: name on left, "Select all" on right), add a compact category dropdown immediately after the name.
  - Options: `All categories`, `Previous Test Results`, `Health History Form`, `Medical Records`, `Diagnostic Testing`.
  - Default: `All categories`.
  - Small width (~180px), uses existing `Select` component, matches modal typography.
- Filtering scope is local: the patient dropdown filters only the patient's docs; the partner dropdown filters only the partner's docs.
- "Select all" in that section operates only on currently visible (matching, non-imported) docs for that person.
- Selections persist across category changes (don't clear the `selected` set when the dropdown value changes).
- Empty state per section: if a person has zero docs matching their chosen category, show a small muted "No documents in this category" line under that section header (keep the header + dropdown visible so the user can switch back).
- Footer "Import selected (N)" continues to reflect total selected across both sections.

### Files
- `src/components/newSession/CnpDocumentsPickerModal.tsx`
  - Remove `activeCategory` global state and pill row JSX.
  - Add two independent states: `patientCategory` and `partnerCategory` (both default `'All'`).
  - Update `renderSection` to accept a `category` value + `onCategoryChange` and render the dropdown in the header.
  - Move filtering logic inside `renderSection` so each section filters its own docs.
- `src/data/demoCnpDocuments.ts` — no changes (seed already covers the 4 categories).

### Out of scope
- No change to category list, no multi-select, no search.
