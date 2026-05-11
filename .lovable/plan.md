## Update both Context tab banners to coral styling

In `src/components/newSession/RightColumnPanel.tsx`, both inline CNP banners currently render with a neutral grey palette. The confirmation banner already has partial coral styling from a prior change; the default-state banner is still grey. This plan unifies both to the same coral treatment.

### Changes

**1. Default-state banner ("N documents available from Onboarding")**
- Background: `bg-primary/10`
- Left border: `border-l-4 border-l-primary` plus a thin `border border-primary/30` on the other sides
- Text colour: `text-primary`
- Paperclip icon: `text-primary`
- "Import" button: stays coral (`text-primary`), unchanged
- Dismiss (✕) button: switch hover/text colours to coral tones so it reads as part of the same banner

**2. Confirmation banner ("N documents imported from Onboarding")**
- Already coral-tinted from the previous edit. Normalise it to match the default-state banner exactly (same border weight, same `bg-primary/10`, same `text-primary`) so the two banners are visually consistent.
- "Add more" link: stays coral, unchanged

### Out of scope

- No changes to size, padding, position, layout, or behaviour of either banner
- No changes to the picker modal, the toast, the file chips, or anything else in the Context tab
- No new design tokens introduced — uses the existing `--primary` (coral) token only
