
# Fix: Tablet sidebar expansion + mobile hamburger overlap

Two small responsive-layout bugs from Phase 1/2.

## Issue 1 — Tablet sidebar can't expand

`src/components/settings/LeftPane.tsx` line 36:

```ts
const isCollapsed = bp === 'tablet' ? true : isCollapsedPref;
```

This hard-forces `isCollapsed = true` at tablet width, so clicking the chevron updates `isCollapsedPref` in localStorage but the sidebar never re-renders as expanded. The toggle button appears functional but does nothing on tablet.

**Fix:** Remove the hard override. Instead, seed the default preference to collapsed on tablet only for users who haven't set one yet, and honor the user's click at every breakpoint.

```ts
const isCollapsed = isCollapsedPref;
// On first mount at tablet width, default to collapsed if user has no saved preference.
useEffect(() => {
  if (bp === 'tablet' && localStorage.getItem('sidebar-collapsed') === null) {
    setIsCollapsedPref(true);
  }
}, [bp]);
```

Result: tablet users open collapsed by default, can click to expand, preference persists.

## Issue 2 — Mobile hamburger overlaps page content

Currently the hamburger button in `LeftPane.tsx` is `fixed top-4 left-4 z-40`. There's no top bar reserving space, so it floats on top of whatever route is rendered and covers headers/toolbars.

**Fix:** Add a mobile top bar in `AppLayout` (visible only `<md`) that reserves ~56px of vertical space and contains the hamburger. Content sits below it, no overlap.

- New tiny component `MobileTopBar.tsx` (rendered in `AppLayout`):
  - `h-14 flex items-center px-3 border-b border-border bg-background md:hidden`
  - Left: hamburger button that toggles a Sheet-hosted sidebar
  - Right: Otto logo mark (small)
- `AppLayout`:
  - Render `<MobileTopBar />` at the top of the main content column on mobile only
  - Main content wrapped so it flows below the bar (`flex-col` already in place)
- `LeftPane.tsx`:
  - Remove the `fixed top-4 left-4` hamburger button (dead code once the top bar owns it)
  - Wire the Sheet open state through a shared context OR lift `isMobileMenuOpen` up — simplest: keep sidebar rendered as today but expose an open handler via a small context (`SidebarMobileContext`) so `MobileTopBar` can trigger it. Alternatively, switch mobile sidebar to shadcn `Sheet` and let the top bar control it directly.

Preferred: convert mobile sidebar to `Sheet` (cleaner, matches what Phase 1 did for the sessions panel). The top bar's hamburger opens the `Sheet`; `LeftPane` renders inside `SheetContent` on mobile only.

## Files touched

```text
src/components/settings/LeftPane.tsx          (tablet toggle fix + remove fixed hamburger + Sheet wrap on mobile)
src/components/layout/AppLayout.tsx           (render MobileTopBar above children on mobile)
src/components/layout/MobileTopBar.tsx        (new)
src/contexts/SidebarMobileContext.tsx         (new — controls Sheet open state; only if not using Sheet directly inline)
```

Zero visual changes at desktop. No new dependencies.

## Verification

- Resize to tablet (~1000px): sidebar starts collapsed, chevron click expands to 256px, click again collapses. Preference persists across reload.
- Resize to mobile (~400px): top bar with hamburger visible; page content (e.g. session header) sits below it, no overlap. Hamburger opens sidebar Sheet.
- Desktop (≥1280px): no top bar, sidebar behavior unchanged.

Approve and I'll implement.
