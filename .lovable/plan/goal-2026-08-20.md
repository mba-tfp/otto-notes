Help Center in-app navigation and category reduction

## Goal
- Open the Help Center in the same tab, like the other internal pages (Template Hub, My Templates).
- Reduce the Help Center to only two cards: **Getting Started** and **Contact Support**. Remove FAQs and Give Feedback for now.

## Changes

### 1. Sidebar Help Center link
File: `src/components/settings/LeftPane.tsx`
- Update the footer item renderer so `resource-center` is treated as an internal route instead of opening in a new tab.
- Keep the desktop-app link behaviour unchanged.
- Active state should still highlight when the user is on `/resource-center`.

### 2. Help Center data
File: `src/data/resourceCenter.ts`
- Remove the `faqs` and `give-feedback` categories from the `categories` array.
- Remove all topics whose `categoryId` is `faqs` or `give-feedback`.
- Keep only `getting-started` and `contact-support` topics.
- The `ContactSupport` component is already wired in `ArticleDetail.tsx` and will remain reachable.

## Result
Clicking **Help Center** in the sidebar will navigate to `/resource-center` within the same tab, and the left nav will show only Getting Started and Contact Support sections.
