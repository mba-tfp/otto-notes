## Goal
Make the entire app render ~10% smaller so browser-100% matches what currently feels right at browser-90%.

## Approach
Apply a global 90% zoom at the app root. Tailwind uses `rem` units throughout, so scaling the root font size cascades to spacing, text, icons, and layout widths without touching individual components.

### Change
In `src/index.css`, under `@layer base`, set:

```css
html {
  font-size: 90%; /* 14.4px base instead of 16px — global ~10% shrink */
}
```

This shrinks everything defined in `rem` (nearly all Tailwind classes: `text-*`, `p-*`, `w-*`, `h-*`, `gap-*`, `rounded-*`, etc.).

### Notes / trade-offs
- Fixed `px` values (e.g. the 320px middle pane, `h-9`, hard-coded pixel widths in a few components) will NOT shrink. Most of the app uses rem-based Tailwind utilities, so the visual effect will still read as "browser at ~90%", but a handful of fixed-px elements may look slightly larger relative to the rest. If that shows up anywhere jarring, I'll follow up and convert those specific spots.
- This does not change the browser zoom indicator; it just makes the default rendering smaller.
- Alternative considered: `zoom: 0.9` on `#root` or `transform: scale(0.9)`. Rejected — `zoom` is non-standard/quirky in Firefox for layout, and `transform` breaks fixed positioning, modals, and popovers. Root `font-size` is the safe, standard approach.

## Files
- `src/index.css` — add `html { font-size: 90%; }` inside `@layer base`.
