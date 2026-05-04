# Open Help Center in a New Tab

The Help Center will become a shared mini-service across Otto products with its own admin panel. As a first step, the sidebar "Help Center" button should open the existing `/resource-center` route in a new browser tab instead of navigating in-app. Design and content updates will follow later.

## Note on placement
The Help Center button is currently in the **left sidebar footer** (next to "What's New"), not a right-side panel. I'll update that button — let me know if you actually meant a different entry point.

## Changes

**`src/components/settings/LeftPane.tsx`** (footer items rendering, ~lines 302–335)
- Special-case the `resource-center` item so its click handler does:
  ```ts
  window.open('/resource-center', '_blank', 'noopener,noreferrer');
  ```
  instead of `navigate(itemRoute)`.
- Remove the `isActive` highlight for the Help Center item (since opening in a new tab means the current route never matches it — same reasoning as the Switch App fix).
- Keep `What's New` behavior unchanged (still in-app navigation, badge logic untouched).
- Apply to both collapsed (icon-only with tooltip) and expanded button variants.

## Out of scope
- No changes to the `/resource-center` route itself — it stays available so the new tab still loads the current page until the standalone Help Center is built.
- No changes to `FeedbackNudgeBanner` (still navigates in-app to `/resource-center?category=feedback`); we can revisit when the external Help Center exists.
- No design changes to the Help Center content yet.
