## Goal

Fix responsive layout issues on `/my-templates` and `/template-hub` for tablet and mobile. Frontend/presentation only — no logic, data, or design-token changes.

## Issues observed

- **My Templates toolbar** (`TemplatesFilters.tsx`) forces search + `Template Hub` + `Create template` buttons on one row. On mobile they cram/wrap awkwardly, and "Create template" loses prominence.
- **Template Hub toolbar** (`TemplateCommunity.tsx`) puts the search bar next to 4 pill filters in a single flex row with `flex-wrap`, which on mobile produces a messy stack where pills sit beside a shrunken search.
- Both pages use `px-10 lg:px-14 py-10` — too much horizontal padding on small screens.
- The Template Hub grid already handles `md:grid-cols-2 lg:grid-cols-3`, so that stays.

## Changes

### 1. `src/pages/MyTemplates.tsx` & `src/pages/TemplateHub.tsx` (container padding)
- Wrapper container: `px-10 lg:px-14 py-10` → `px-4 sm:px-6 lg:px-14 py-6 sm:py-8 lg:py-10`.

### 2. `src/components/templates/TemplatesFilters.tsx`
- Outer row: `flex items-center justify-between gap-4 mb-8` → `flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8`.
- Search wrapper: keep `flex-1`, drop `max-w-md` on mobile → `w-full sm:max-w-md`.
- Buttons row: `flex gap-3` → `flex gap-2 sm:gap-3 w-full sm:w-auto`.
  - `Template Hub` button: `flex-1 sm:flex-none` so it shares row with Create on mobile.
  - `Create template` button: `flex-1 sm:flex-none` and keep primary styling.
- Both buttons get `whitespace-nowrap` and `justify-center` so labels don't wrap.

### 3. `src/components/templates/TemplateCommunity.tsx` (Search + Filters row)
- Change the search-and-filters row from a single horizontal flex into a two-row stack on mobile/tablet:
  - Wrapper: `flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4 mb-6 lg:mb-8`.
  - Search: `w-full lg:max-w-md` (full width on tablet/mobile).
  - Filters container: wraps to its own row, horizontally scrollable on very narrow screens.

### 4. `src/components/templates/hub/TemplateFilters.tsx`
- Outer container: `flex items-center gap-3 flex-wrap` → `flex items-center gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:gap-3 -mx-4 px-4 sm:mx-0 sm:px-0`.
  - Enables horizontal scroll on mobile so pills stay on one clean line instead of stacking messily; wraps normally from `sm` up.
- Add `shrink-0` to each `FilterPill` `<button>` so pills keep their intrinsic size while scrolling.
- `Clear all` button gets `shrink-0 whitespace-nowrap`.

### 5. Optional: `TemplatesHeader.tsx` and Hub header
- Title `text-[32px]` → `text-2xl sm:text-[32px]` in both headers so titles don't dominate small screens. Subtitle keeps `ml-10`.

## Out of scope

- Design tokens, colors, spacing scale.
- Table responsiveness inside `TemplatesTable` (not called out by user).
- Any data / hook / backend changes.

## Verification

- 375px (mobile): My Templates shows search full width above a 2-button row (Hub + Create side-by-side, both full-width halves). Template Hub shows search full width, then a single horizontally scrollable filter pill row.
- 900px (tablet): My Templates stays single row (search left, buttons right). Template Hub filters stacked below the full-width search, wrapping as needed.
- 1440px (desktop): unchanged from today.
