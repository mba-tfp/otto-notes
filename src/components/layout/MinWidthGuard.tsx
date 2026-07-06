import { ReactNode } from 'react';

/**
 * Wraps pages that have not been made responsive yet.
 * On narrow viewports the content stays at its natural desktop width and the
 * user can scroll horizontally, so nothing visually breaks.
 */
export const MinWidthGuard = ({
  children,
  minWidth = 1024,
}: {
  children: ReactNode;
  minWidth?: number;
}) => (
  <div className="h-full w-full overflow-auto">
    <div style={{ minWidth }} className="h-full">
      {children}
    </div>
  </div>
);
