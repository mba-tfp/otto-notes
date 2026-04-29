## Goal
Remove the Salmon left accent bar from the Switch App button so it doesn't appear "active" when its popover is open. The accent bar is reserved for true route-based active states (What's New, Help Center).

## Change

### `src/components/sidebar/SwitchAppPopover.tsx`
- Remove the `{open && <span ... bg-primary />}` accent bar from the trigger.
- Also drop the `open`-driven `text-foreground font-semibold` / `strokeWidth=2.5` shift so the trigger stays in its resting muted style at all times. Keep the existing hover styles.

## Out of scope
- No changes to What's New / Help Center (they keep the accent bar tied to route).
- No changes to main nav.
