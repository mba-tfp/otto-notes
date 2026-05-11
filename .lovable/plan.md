## Fixes — Search → Import documents workflow

Implement the four QA items you accepted plus the three new bugs.

### 1. Single-doc selection bug (modal)
**Root cause:** In `CnpDocumentsPickerModal.tsx`, the row `<div onClick={toggleDoc}>` AND the inner `<Checkbox onCheckedChange={toggleDoc}>` both call `toggleDoc`. Clicking the checkbox bubbles to the row → toggles twice → net zero change. Only the section-level "Select all" works because it's outside that row.

**Fix:** Remove the `onCheckedChange` on the inner Checkbox (let the row handler own it) and add `onClick={(e) => e.stopPropagation()}` on the Checkbox so clicking it still bubbles cleanly to the row exactly once. Same pattern used in other multi-select rows in the app.

### 2. Ghazanfar Ali patient row looks glitchy
**Root cause:** Patient row in `PatientSelector.tsx` (lines 416-458) has avatar + name (`flex-1 min-w-0 truncate`) + EMR/CNP block (`flex-shrink-0`) + Edit button. Ghazanfar's data has the longest right-side block in the list (`EMR ID: GA-1985` + `CNP ID: CNP-DEMO-GA`), squeezing the name column to near-zero width — name appears clipped/hidden.

**Fix:** Constrain the right-side metadata column with `max-w-[110px]` and let CNP ID truncate, OR drop the `CNP ID:` label and show just the value at smaller text. Concretely: change the EMR/CNP block to a fixed-width column (`w-[110px] text-right text-[11px] leading-tight`) so the name column always has room. Verify visually after the change.

### 3. Document picker — name on the right of "Select all"
You'd like the person's name to sit on the right side, in line with the Select-all row, instead of the left. Update `renderSection` in `CnpDocumentsPickerModal.tsx`: move the bold name to the right of the row (after Select all), e.g. `[ ✓ Select all ............... Ghazanfar Ali ]` with `justify-end` and the name styled as bold `text-secondary` to match the existing weight.

### 4. (Accepted #1) De-duplicate toast vs inline banner
Don't show the toast when the inline banner is already visible — the banner covers the same purpose and they currently double up. Implementation: in the toast `useEffect`, add a guard `if (activeView === 'context') return;` so the toast only fires when the user is on the Note view (i.e. likely to miss the banner). Toast still arms once per patient.

### 5. (Accepted #3) Reset toast-fired ref on patient change
In the patient-change effect (lines 115-119 of `RightColumnPanel.tsx`), also reset `cnpToastFiredRef.current = null` so re-selecting the same patient after deselect re-arms the toast. More predictable.

### 6. (Accepted #4) Re-summon dismissed banner
After the user dismisses the inline banner with ✕, add a small inline link inside the file-upload zone: `"📎 5 documents available from Onboarding — Show"`, only visible when `cnpBannerDismissed && cnpImportedFilenames.size === 0 && cnpDocs.length > 0`. Clicking re-opens the picker. Subtle, coral text-link styling.

### 7. (Accepted #5) Toast auto-dismiss timing
Move dismissal logic out of the React effect cleanup so quick state changes (like opening the picker) don't kill the toast prematurely. Use Sonner's `onAutoClose`/`onDismiss` callbacks to clear `toastId` instead of an effect cleanup. Effect only fires the toast; it never dismisses it.

---

### Files to edit
- `src/components/newSession/CnpDocumentsPickerModal.tsx` — items 1 & 3
- `src/components/newSession/PatientSelector.tsx` — item 2
- `src/components/newSession/RightColumnPanel.tsx` — items 4, 5, 6, 7

No backend, no schema, no new dependencies.
