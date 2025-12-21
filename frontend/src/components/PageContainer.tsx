import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Standard page wrapper component
 *
 * Provides consistent padding across all pages:
 * - px-6 (24px horizontal) - Standard page margins
 * - pt-6 (24px top) - Spacing below sticky header
 * - pb-32 (128px bottom) - Extra space above bottom navigation
 *
 * @see DESIGN_SYSTEM.md - Spacing & Layout section
 */
export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`px-6 pb-32 pt-6 ${className}`.trim()}>
      {children}
    </div>
  );
};
