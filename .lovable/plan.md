## Add "Unsend" for letters

Lets a sender reverse a `sent` letter back to `to_be_sent` within 24 hours so they can fix mistakes (e.g. wrong patient ID). Available to anyone who can view the letter.

### Behavior

- A `sent` letter can be unsent within **24 hours** of its `sentAt` timestamp.
- Unsending sets `status` back to `to_be_sent`, clears `sentAt`, and bumps `updatedAt`. The letter becomes editable again.
- After 24 hours, the Unsend action is **hidden** (not just disabled) to keep the UI clean. Hover tooltip on the disabled state isn't needed since it's hidden.
- Confirmation dialog before unsending, matching the Delete pattern.
- Toast on success: *"Letter moved back to 'To be sent'"*.

### Where it appears

1. **Letter detail header** (`LetterDetail.tsx`) — for `sent` letters within the 24h window, show an `Undo2` icon button labeled **"Unsend"** in the action bar, placed before Copy/PDF.
2. **Letter card three-dot menu** (`LetterCard.tsx`) — extend the `⋯` menu (currently only on `to_be_sent`) to also show on eligible `sent` cards, with a single **Unsend** item.

### Technical changes

- **`src/contexts/LettersContext.tsx`**
  - Add `unsendLetter(id: string)` to the context type and provider. Implementation: set `status: 'to_be_sent'`, `sentAt: undefined`, `updatedAt: new Date()`.
  - Add a small helper `canUnsend(letter)` exported from the context (or co-located in `src/types/letter.ts`) that returns `true` when `status === 'sent'` and `sentAt` is within the last 24 hours.

- **`src/components/letters/LetterDetail.tsx`**
  - Import `unsendLetter` and `canUnsend`.
  - When `letter.status === 'sent' && canUnsend(letter)`, render an Unsend button in the action bar (icon: `Undo2` from lucide). Wire it to an `AlertDialog` with copy: *"Move this letter back to 'To be sent'? It will become editable again."* Confirm calls `unsendLetter` and shows a toast.

- **`src/components/letters/LetterCard.tsx`**
  - Change the menu visibility condition from `letter.status === 'to_be_sent'` to `letter.status === 'to_be_sent' || canUnsend(letter)`.
  - When the letter is `sent`, the menu shows only an **Unsend** item (no Delete, matching the existing deletion policy). Reuses the same confirmation dialog pattern.

- **No DB / RLS changes** — letters are still in-memory demo data via `LettersContext`. When letters move to Supabase later, the same logic applies via an UPDATE policy gated by `sentAt > now() - interval '24 hours'`.

### Out of scope (flagged for later)

- Audit log of who unsent / when (will matter once real transmission exists).
- Role gating — current decision is "anyone who can view" per your answer; revisit if real send/transmit is added.
- Actual email/fax retraction — today "sent" is just a status flag, so unsend is purely an internal state change.
