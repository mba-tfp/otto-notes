## Expand demo docs & make per-person lists scrollable

### Seed data (`src/data/demoCnpDocuments.ts`)
- Expand `CNP-DEMO-GA` from 4 → ~10 docs per person (patient: Ghazanfar Ali, partner: Nimra Jafar), distributed across all 4 categories so filtering is visible.
- Realistic filenames + varied dates spanning late 2025 → mid 2026.

### Modal (`src/components/newSession/CnpDocumentsPickerModal.tsx`)
- Wrap each section's document list in a scrollable container: `max-h-[240px] overflow-y-auto pr-1` (roughly 5 rows visible, scrolls beyond).
- Section header (name + category dropdown + Select all) stays fixed above the scroll area.
- Both patient and partner sections scroll independently; outer `DialogBody` continues to handle overall modal scroll as a fallback.
- No other behavior changes (selection, filtering, footer count unchanged).

### Out of scope
- No new categories, no search, no layout/header changes.
