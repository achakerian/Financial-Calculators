# Financial Calculators - Project Reference

**Last Updated:** 2025-12-21
**Current Branch:** `redesign-v3`
**Main Branch:** `main`

---

## Project Overview

A mobile-first financial calculator platform built with React, TypeScript, and Tailwind CSS. The application provides calculators for loans, pay & tax, and superannuation calculations for Australian tax residents.

**Target Platform:** Mobile-first (desktop responsive later)
**Design Pattern:** Bottom navigation with category-based organization

---

## Tech Stack

- **Framework:** React 18.3.1 + TypeScript 5.5.0
- **Build Tool:** Vite 5.2.0
- **Styling:** Tailwind CSS 3.4.x
- **Routing:** React Router DOM 7.11.0
- **Charts:** Recharts 2.10.0
- **Package Manager:** pnpm 9.0.0
- **Monorepo:** Yes (workspaces: frontend, calc-engine, api)

---

## Documentation

- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - Complete design system documentation
  - Color palette (light & dark mode)
  - Typography scale and patterns
  - Component specifications
  - Spacing and layout standards
  - Accessibility guidelines
  - Code examples and usage patterns

**📘 Read DESIGN_SYSTEM.md before creating new UI components**

---

## Folder Structure

```
Financial Calculators/
├── frontend/                 # Main React application
│   ├── src/
│   │   ├── lib/             # Core business logic (PRESERVED)
│   │   │   ├── payModel.ts           # Pay calculation engine
│   │   │   ├── payTypes.ts           # Type definitions for pay calculations
│   │   │   ├── taxConfig.ts          # Tax year configurations (2020-2026)
│   │   │   ├── payModel.test.ts      # Tests for pay model
│   │   │   └── taxConfig.test.ts     # Tests for tax config
│   │   ├── components/      # Reusable UI components
│   │   │   ├── BottomNav.tsx         # Mobile bottom navigation
│   │   │   ├── icons.tsx             # SVG icon components
│   │   │   └── ui/                   # Future UI components
│   │   ├── layouts/         # Layout components
│   │   │   └── MainLayout.tsx        # Main layout with bottom nav
│   │   ├── pages/           # Route-based page components
│   │   │   ├── LoansPage.tsx         # Loans category page
│   │   │   ├── PayTaxPage.tsx        # Pay & Tax category page
│   │   │   ├── SuperPage.tsx         # Superannuation category page
│   │   │   └── LoginPage.tsx         # Login/Auth page
│   │   ├── features/        # OLD calculator components (to be migrated)
│   │   │   ├── PayCalculator.tsx     # Original pay calculator (41K lines)
│   │   │   ├── SuperContributions.tsx
│   │   │   ├── BorrowingCapacity.tsx
│   │   │   ├── RepaymentCalculator.tsx
│   │   │   └── AdvancedSimulator.tsx
│   │   ├── graphs/          # Chart components
│   │   │   ├── CapacityCharts.tsx
│   │   │   ├── RepaymentCharts.tsx
│   │   │   └── SimulatorCharts.tsx
│   │   ├── App.tsx          # NEW: Root component with router
│   │   ├── main.tsx         # Entry point
│   │   └── styles.css       # Tailwind directives
│   ├── package.json         # Frontend dependencies
│   ├── tailwind.config.js   # Tailwind configuration
│   ├── postcss.config.js    # PostCSS configuration
│   └── vite.config.ts       # Vite configuration
├── calc-engine/             # Calculation logic workspace
├── api/                     # Backend API workspace
├── package.json             # Monorepo root
├── pnpm-workspace.yaml      # Workspace configuration
├── PROJECT_REFERENCE.md     # This file
└── DESIGN_SYSTEM.md         # Design system documentation

```

---

## Core Business Logic

### Location: `frontend/src/lib/`

**These files contain critical tax and pay calculation logic - DO NOT DELETE:**

#### 1. `payTypes.ts`
- Type definitions for pay frequency, tax residency, Medicare options
- Types: `PayFrequency`, `TaxResidency`, `MedicareOption`, `SuperMode`

#### 2. `taxConfig.ts` (17KB, 594 lines)
- Tax configurations for FY 2020-21 through 2025-26
- Includes:
  - Resident & non-resident tax brackets
  - Medicare levy calculations
  - HELP/HECS repayment thresholds (legacy & marginal systems)
  - Concessional superannuation caps
- Key exports:
  - `TAX_YEAR_CONFIGS[]` - Array of all tax year configurations
  - `TAX_YEAR_MAP` - Record for quick lookup
  - `DEFAULT_TAX_YEAR_ID` - Currently '2025-26'
  - `createTaxCalculators()` - Factory function for tax calculators
  - Functions: `calculateAnnualTax`, `calculateMedicare`, `calculateHelpRepayments`, `calculateTaxBreakdown`

#### 3. `payModel.ts` (4.5KB, 189 lines)
- Pure business logic for pay calculations
- Dependency injection pattern for testability
- Key exports:
  - `buildPayModel()` - Main calculation function
  - `FREQUENCY_LABEL` - Display labels for frequencies
  - `PER_FACTOR` - Annual multipliers for each frequency
  - `getFinancialYearProgress()` - Calculates FY progress percentage
- Interfaces:
  - `PayModelInputs` - All user inputs
  - `PayModelOutputs` - All calculated results
  - `PayModelDependencies` - Injected calculator functions

---

## Navigation Structure

### Bottom Navigation (Mobile)

4 main categories accessible via bottom navbar:

1. **Loans** (`/loans`)
   - Repayment Calculator
   - Borrowing Capacity Calculator

2. **Pay & Tax** (`/pay-tax`)
   - Pay Calculator (primary focus)
   - Tax Breakdown visualization
   - FYTD (Financial Year To Date) calculations

3. **Super** (`/super`)
   - Super Contributions Calculator
   - Concessional cap tracking

4. **Login** (`/login`)
   - User authentication
   - Account management

**Default Route:** Redirects `/` → `/pay-tax`

---

## Key Components

### BottomNav.tsx
- Fixed bottom navigation bar
- Active state highlighting (blue for active, gray for inactive)
- SVG icons from `icons.tsx`
- Uses React Router's `NavLink` for automatic active state

### MainLayout.tsx
- Wraps all pages
- Max width: `screen-sm` (640px) for mobile-first
- Adds bottom padding to prevent content hiding behind nav
- Background: `bg-slate-50`

### Icons
- `HomeIcon` - Loans category
- `CalculatorIcon` - Pay & Tax category
- `PiggyBankIcon` - Super category
- `UserIcon` - Login/Profile

---

## Development Commands

```bash
# Install dependencies
pnpm install

# Start dev server (runs on http://localhost:5173 or 5174)
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Preview production build
pnpm preview
```

---

## Git Information

**Current Commit:** `41943e1` - "Aesthetic Improvements"
**Repository:** https://github.com/achakerian/Financial-Calculators.git

### Recent History
- `41943e1` - Aesthetic Improvements (CURRENT)
- `922c4fd` - Pay and Tax Calculator optimised
- `34249e6` - UI/UX update
- `79374e1` - paycalculator functionality and aesthetics

---

## Migration Status

### ✅ Completed
- Tailwind CSS v3 setup
- React Router v7 integration
- Bottom navigation implementation
- Page scaffolding (Loans, Pay & Tax, Super, Login)
- Core business logic preserved in `/lib`
- Mobile-first layout structure

### 🚧 In Progress
- Pay & Tax Calculator UI rebuild

### ⏳ Pending
- Migrate Repayment Calculator to new design
- Migrate Borrowing Capacity Calculator
- Migrate Super Contributions Calculator
- Implement chart components with new styling
- Add dark mode support
- Implement authentication system

---

## Design Guidelines

### Mobile-First Principles
- Max content width: 640px (sm breakpoint)
- Touch-friendly buttons (min 44px height)
- Bottom navigation for thumb accessibility
- No hamburger menus on mobile

### Color Palette (Tailwind)
- Primary: Blue 600 (`#2563eb`)
- Background: Slate 50 (`#f8fafc`)
- Text Primary: Gray 900 (`#111827`)
- Text Secondary: Gray 600 (`#4b5563`)
- Border: Gray 200 (`#e5e7eb`)

### Typography
- Headings: Bold, Gray 900
- Body: Regular, Gray 600
- Labels: Medium, Gray 700

---

## Important Notes for AI Assistants

### DO NOT DELETE OR MODIFY:
1. `frontend/src/lib/` - Contains critical tax calculation logic
2. `frontend/src/features/` - Old components (reference for migration)
3. Tax year configurations in `taxConfig.ts` (sourced from ATO)

### WHEN BUILDING CALCULATORS:
1. Import types from `lib/payTypes.ts`
2. Import calculators from `lib/taxConfig.ts`
3. Use `lib/payModel.ts` for pay calculations
4. Follow dependency injection pattern
5. Keep business logic separate from UI components

### FILE NAMING CONVENTIONS:
- Pages: `PascalCase` + `Page.tsx` (e.g., `PayTaxPage.tsx`)
- Components: `PascalCase.tsx` (e.g., `BottomNav.tsx`)
- Utils/Lib: `camelCase.ts` (e.g., `payModel.ts`)

### TESTING:
- Unit tests for all calculation logic
- Tests use `.test.ts` suffix
- Vitest framework

---

## Quick Reference

### Australian Tax Specifics
- **Tax Year:** July 1 - June 30
- **Default Tax Year:** 2025-26 (FY ending 30 June 2026)
- **HELP Repayments:** Changed to marginal system in 2025-26
- **Superannuation Guarantee:** 11.5% (2025-26)
- **Concessional Cap:** $30,000 (2025-26)

### Pay Frequencies
- Weekly: 52 periods/year
- Fortnightly: 26 periods/year
- Monthly: 12 periods/year
- Annual: 1 period/year
- FYTD: Financial Year To Date

### Tax Residency Types
- `resident` - Australian tax resident
- `foreign` - Foreign resident for tax purposes
- `whm` - Working Holiday Maker

### Medicare Levy Options
- `full` - 2% levy
- `reduced` - 1% levy (low income)
- `exempt` - No levy

---

## Next Steps

1. **Immediate:** Build Pay & Tax Calculator UI
   - Use preserved logic from `lib/`
   - Create form inputs with Tailwind styling
   - Display results in cards
   - Add tax breakdown visualization

2. **Short-term:**
   - Migrate other calculators
   - Add chart components
   - Implement state management (if needed)

3. **Long-term:**
   - Dark mode
   - User accounts & data persistence
   - Advanced features (scenario comparison, etc.)
   - Desktop responsive design

---

## Support Information

**Developer:** Aaron Chakerian
**Last Commit Author:** achakerian@gmail.com
**Project Type:** Personal/Portfolio Project
**License:** Private

---

## Token Optimization Tips for AI

- **Reference this document first** before reading source files
- Business logic locations are documented - no need to search
- Tax year data is accurate - don't recalculate or verify
- Migration pattern is clear: UI layer only, preserve logic
- File structure is defined - don't use Glob unnecessarily
- Tech stack is stable - no architecture questions needed

---

*This document should be updated when major changes occur to maintain accuracy.*
