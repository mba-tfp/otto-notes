## Plan

Fix the patient/partner name label in the document import modal so it is visible again.

### What I’ll change
1. Update the section header label in `src/components/newSession/CnpDocumentsPickerModal.tsx`.
2. Replace the current `text-secondary` class with a foreground token that matches the rest of the modal text and stays visible in this theme.
3. Leave the layout and behavior unchanged — this is only a styling correction.

### Why this is happening
The label currently uses `text-secondary`, but in this design system `secondary` is a background-style token and is white in light mode, so the text disappears against the modal background.

### Technical details
- Current class: `text-secondary`
- Safer replacement: `text-foreground` or `text-secondary-foreground`
- Scope: one small frontend edit in `CnpDocumentsPickerModal.tsx` only