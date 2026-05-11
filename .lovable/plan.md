# Demo Patient + CNP Document Import (Context Tab)

Add a hardcoded demo patient and a CNP-style "Documents from Onboarding" import flow into the Context tab. Purely additive — no existing behavior changes.

## 1. Demo patient data

Add to `defaultPatients` in `src/contexts/PatientsContext.tsx` (bump `CURRENT_VERSION` to 3 so existing local storage refreshes):

- Ghazanfar Ali (DOB 1985-03-12), partner Nimra Jafar (DOB 1988-07-24), `cnpId: 'CNP-DEMO-GA'`.

Existing partner auto-fill in `SessionHeaderRow` already populates the Partner pill — no changes needed there.

## 2. Hardcoded CNP documents

New file `src/data/demoCnpDocuments.ts`:

```ts
export interface DemoCnpDocument {
  id: string;
  owner: 'patient' | 'partner';
  ownerName: string;
  filename: string;
  category: string;       // e.g. "Medical Records"
  date: string;           // "Apr 10, 2026"
}

export const DEMO_CNP_DOCS_BY_PATIENT: Record<string, DemoCnpDocument[]> = {
  'CNP-DEMO-GA': [ ...5 documents listed in the brief... ],
};
```

Keyed by `cnpId` so only the demo patient triggers the flow.

## 3. Context tab banner

Edit `src/components/newSession/ContextTab.tsx` to accept the currently selected patient (passed down from `MainTabsContainer` → through whatever currently renders ContextTab). Add new props: `selectedPatient: Patient | null`.

State held inside ContextTab:
- `bannerDismissed: boolean`
- `importedFilenames: Set<string>`
- `pickerOpen: boolean`

Banner renders above the existing toolbar/textarea when:
- patient is selected AND has entries in `DEMO_CNP_DOCS_BY_PATIENT`
- `bannerDismissed` is false
- `importedFilenames.size === 0`

Banner style: subtle blue-grey using existing tokens (`bg-muted/60 border border-border text-foreground`), rounded, paperclip icon, "[N] documents available from Onboarding", `[Import]` ghost button (opens picker), `✕` icon (dismiss for session).

After successful import, banner becomes static text only: `📎 N documents imported from Onboarding` (no buttons, no dismiss). Replaces the interactive banner.

When patient changes/clears: reset `bannerDismissed`, `importedFilenames`, and post-import message.

## 4. Picker modal

New component `src/components/newSession/CnpDocumentsPickerModal.tsx` using existing `Dialog` primitives.

- Title: `Documents for {patient} & {partner}` (or just patient if no partner)
- Subtitle: `From Otto Onboarding` — `text-sm text-muted-foreground`
- Body: grouped sections (`patient`, then `partner`); each section has bold dark-navy header (`text-secondary` token / Ocean) plus a "Select all" checkbox aligned right.
- Each row: `Checkbox` + PDF icon (`FileText` from lucide) + filename + small grey pill (`Badge variant="secondary"` rounded-full) + right-aligned date in `text-muted-foreground`.
- Already-imported docs: `disabled` checkbox, replace date with "Already in context".
- Footer: left "Skip" plain text button (`variant="ghost"`) → closes modal + dismisses banner. Right "Import selected (N)" → coral primary button (existing `bg-primary` salmon), disabled until ≥1 selected, label updates live.

## 5. Post-import behaviour

On confirm:
- Add a method `addImportedDocuments(docs: { name: string; extractedText?: string }[])` to `useDocumentOCR` that pushes entries with `status: 'complete'`, `progress: 100` (skipping the simulated processing). Reuses the existing `FileProcessingItem` rendering so they look identical to manually uploaded files.
- Update local `importedFilenames` set with the picked filenames.
- Close modal; banner switches to static confirmation text.
- Reopening picker via any future trigger shows imported items disabled with "Already in context".

## 6. Wiring

`ContextTab` currently has no patient prop. Trace the call site (likely `MainTabsContainer` / `NewSession`) and pass `selectedPatient` through. No other behaviour changes.

## Visual rules

- Reuse existing tokens: `bg-muted`, `border-border`, `text-secondary` (Ocean navy) for section headers, `bg-primary` (Salmon) only for the Import CTA, `Badge` for category pill, `Dialog` overlay for backdrop. No new CSS variables.

## Files

- edit `src/contexts/PatientsContext.tsx` (add patient + version bump)
- new `src/data/demoCnpDocuments.ts`
- new `src/components/newSession/CnpDocumentsPickerModal.tsx`
- edit `src/components/newSession/ContextTab.tsx` (banner + picker integration + accept patient prop)
- edit `src/hooks/useDocumentOCR.ts` (add `addImportedDocuments`)
- edit ContextTab's parent (likely `MainTabsContainer.tsx`) to pass `selectedPatient` prop
