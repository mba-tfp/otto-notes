# Add Speaker Input + Rearrange Recording Controls

## Goal
- Add a **Speaker (audio output) selector** next to the Microphone selector in the top session header.
- Keep the **Microphone selector** where it currently is (top-right of `SessionInfoBar`).
- Move the **Transcribe/Dictate action button** and the **Transcribe / Dictate segmented pill** up into that same top header, sitting to the right of the speaker selector.
- The bottom `RecordingControlsBar` (if still shown anywhere below) no longer duplicates these controls.

Scope: UI only. No backend, no real device I/O wiring beyond the existing browser enumerateDevices pattern.

## Target layout (top header, right side)
```text
[00:16 timer] [🎙 Mic ▾ ▮▮▮▮▯] [🔊 Speaker ▾]   [Pause] [Transcribe ●] [ Transcribe | Dictate ]
```

## Changes

### 1. New component: `src/components/newSession/SpeakerSelector.tsx`
- Mirror `MicrophoneSelector.tsx` styling/behavior for consistency.
- Enumerate `audiooutput` devices via `navigator.mediaDevices.enumerateDevices()`.
- Same trigger look: white outline pill, icon + truncated label + chevron, dropdown with check-marked selected item.
- Use `Volume2` (or `Speaker`) icon from lucide-react.
- Props: `selectedDeviceId`, `onDeviceChange`.
- No audio-level meter (output devices don't have input levels).
- Note: browsers restrict programmatic output-device changes; this is a UI-only selector for now (same "demo" fidelity as the mic bars).

### 2. `SessionInfoBar.tsx`
- Add `selectedSpeakerId` + `onSpeakerChange` props.
- Render `<SpeakerSelector />` directly to the right of `<MicrophoneSelector />`.
- Keep `<RecordingModeButton />` where it already is (right end of the header). It already contains the Transcribe/Dictate action button, the Pause/Resume button, and the Transcribe|Dictate segmented pill — so "moving controls to the top header" is satisfied by ensuring these live only here.

### 3. `NewSession.tsx` (parent page)
- Add local state `selectedSpeakerId` and pass it + setter into `SessionInfoBar`.
- Confirm no duplicate Transcribe/Dictate controls are rendered elsewhere below the header. If a bottom bar still renders `RecordingModeButton` or an equivalent action, remove that instance so controls live only in the top header.

### 4. Cleanup
- Do not modify unrelated components (`RecordingControls.tsx` in `src/components/session/` is a separate legacy view — leave untouched unless it is actively mounted on `/new-session`; verify during implementation and remove duplication only if present).

## Non-goals
- Actual routing of audio to selected output device (`HTMLMediaElement.setSinkId`) — future work.
- Grouping outputs by "Speakers / Apps" like the reference screenshot — we'll ship a flat device list first.
- Any change to recording logic, timers, or transcript simulation.
