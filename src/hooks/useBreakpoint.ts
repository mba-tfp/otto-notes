import { useEffect, useState } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

const TABLET_MIN = 768;
const DESKTOP_MIN = 1280;

const getBp = (w: number): Breakpoint => {
  if (w < TABLET_MIN) return 'mobile';
  if (w < DESKTOP_MIN) return 'tablet';
  return 'desktop';
};

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>(() =>
    typeof window === 'undefined' ? 'desktop' : getBp(window.innerWidth)
  );

  useEffect(() => {
    const onResize = () => setBp(getBp(window.innerWidth));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return bp;
}

export const useIsBelowDesktop = () => useBreakpoint() !== 'desktop';
export const useIsMobileBp = () => useBreakpoint() === 'mobile';
