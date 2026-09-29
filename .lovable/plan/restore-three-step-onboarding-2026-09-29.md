# Restore three-step onboarding

## Changes
- Rebuild Step 1 to match the supplied reference: bordered header, profile image row, three-column identity row, full-width specialty/location/phone/language fields, optional labels, and full-width Continue button.
- Remove the preferred-name and terms fields from Step 1, as they are absent from the reference; keep the required name and specialty validation.
- Restore Step 2 as the supplied signature setup screen with Back, rich-text formatting, signature preview/editing, letter toggle, and Continue.
- Save the signature settings through the existing local signature settings used elsewhere in Otto Notes.
- Make Training & Resources Step 3; Back returns to signature setup, while Skip and Continue finish onboarding.

## Technical details
- Reuse the existing rich-text editor, toolbar, switch, and semantic design tokens.
- Keep all three dialogs within the existing 90% viewport height limit without internal scrolling where the supplied layouts fit.

## Verification
- Walk through all three steps in the preview.
- Confirm Step 1 matches the reference, Step 2 saves its content and toggle, and Step 3 returns to Step 2.
