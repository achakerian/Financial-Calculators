import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
}

/**
 * Standard page wrapper component
 *
 * Provides consistent padding and responsive max-width across all pages:
 * - px-6 (24px horizontal) - Standard page margins
 * - pt-4 (16px top) - Tight spacing below sticky header
 * - pb-6 (24px bottom) - Minimal space (MainLayout provides pb-20 for BottomNav)
 * - max-w-md (448px) - Mobile-first narrow width (mobile portrait)
 * - lg:max-w-2xl (672px) - Expands on tablet/desktop (≥1024px)
 * - xl:max-w-4xl (896px) - Further expands on wide desktops (≥1280px)
 * - borderColor (optional) - Adds a full-height left border with the specified color
 *
 * @see DESIGN_SYSTEM.md - Spacing & Layout section
 */
export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
  borderColor
}) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useLayoutEffect(() => {
    const updateStripLeft = () => {
      if (typeof window === 'undefined') return;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const styles = window.getComputedStyle(el);
      const padLeft = parseFloat(styles.paddingLeft || '0');
      const GAP_PX = 25; // visual gap between container and vertical strip
      const leftPx = Math.max(0, rect.left + padLeft - GAP_PX);
      document.documentElement.style.setProperty('--page-strip-left', `${leftPx}px`);
    };

    updateStripLeft();
    window.addEventListener('resize', updateStripLeft);
    return () => window.removeEventListener('resize', updateStripLeft);
  }, []);

  return (
    <div className="relative">
      {borderColor && (
        <div
          className={`fixed top-0 h-screen w-1 ${borderColor} opacity-40`}
          style={{ zIndex: 1, left: 'var(--page-strip-left, 24px)' }}
        />
      )}
      <div ref={containerRef} className={`mx-auto max-w-md px-6 pb-6 pt-4 lg:max-w-2xl xl:max-w-4xl ${className}`.trim()}>
        {children}
      </div>
    </div>
  );
};
