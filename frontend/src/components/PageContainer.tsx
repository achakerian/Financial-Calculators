import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
}

/**
 * Standard page wrapper component
 *
 * Provides consistent padding across all pages:
 * - px-6 (24px horizontal) - Standard page margins
 * - pt-4 (16px top) - Tight spacing below sticky header
 * - pb-32 (128px bottom) - Extra space above bottom navigation
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
    <div className="relative min-h-screen">
      {borderColor && (
        <div
          className={`fixed top-0 h-screen w-1 ${borderColor} opacity-40`}
          style={{ zIndex: 1, left: 'var(--page-strip-left, 24px)' }}
        />
      )}
      <div ref={containerRef} className={`mx-auto max-w-md px-6 pb-32 pt-4 ${className}`.trim()}>
        {children}
      </div>
    </div>
  );
};
