## Three focused fixes

### 1. Patient search row — name is clipped to "G…" / "gh…"
**Cause:** `DropdownMenuContent` is `w-72` (288px). After avatar (40px), EMR/CNP block (110px), Edit button (~50px) and gaps, the name column has only ~70px left, so "Ghazanfar Ali" collapses to two truncated lines.

**Fix in `PatientSelector.tsx` (line 391):** widen the dropdown to `w-[420px]` (or `min-w-[420px]`) so the name column always has comfortable room. No layout class changes elsewhere.

### 2. Picker modal — name + "Select all" on the same line, name on the LEFT
Revert my previous move. The patient/partner name should sit on the **left** as the section label (so it specifies *whose* documents these are), with **"Select all" aligned to the right** of the same row.

**Fix in `CnpDocumentsPickerModal.tsx` `renderSection`:**
```
[ Ghazanfar Ali .................................... ☐ Select all ]
[ ☐  📄 file.pdf  …  Medical Records  …  Apr 10, 2026 ]
```
Use `flex items-center justify-between`, name as bold `text-secondary` on the left, "Select all" label + checkbox on the right. Same row for both patient and partner sections.

### 3. No way to reopen the picker after all docs are imported
**Cause:** in `RightColumnPanel.tsx` line 615, the "Add more" link only renders when `cnpImportedFilenames.size < cnpDocs.length`. Once everything is imported, the confirmation banner has no action and the picker is unreachable.

**Fix:** keep the "Add more" link only when more remain, but **always** show a trailing action on the confirmation banner — when all docs are imported, render `"View imported"` (coral text-link) that reopens the same picker modal. Inside the modal, already-imported docs are shown as "Already in context" and disabled, so this acts as a review/re-open affordance.

---

### Files to edit
- `src/components/newSession/PatientSelector.tsx` — widen dropdown (item 1)
- `src/components/newSession/CnpDocumentsPickerModal.tsx` — restore name on left of Select-all row (item 2)
- `src/components/newSession/RightColumnPanel.tsx` — add "View imported" fallback action on confirmation banner (item 3)

No other behavior, sizes, colors, or copy changes.
