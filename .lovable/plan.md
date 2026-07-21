## Problem

The Speaker (and Microphone) selector pill shows "Default - Headset Ea..." with visible empty space to the right of the truncated text — the pill looks half empty.

Root cause: both `SpeakerSelector.tsx` and `MicrophoneSelector.tsx` apply a JS `truncateLabel(label, 20)` that hard-caps the label at 20 characters and appends `...`, even though the button is `w-[200px]` and the inner `<span>` already has the CSS `truncate` class that would clip to the actual available width.

## Fix

In `src/components/newSession/SpeakerSelector.tsx` and `src/components/newSession/MicrophoneSelector.tsx`:

- Remove the `truncateLabel` helper.
- Render `{selectedLabel}` directly inside the existing `<span class="flex-1 truncate ...">`, letting CSS handle overflow so the text fills the pill's full width and only ellipsizes when it actually overflows 200px.

No other files, styling, or behavior change.
