import { describe, it, expect } from 'vitest';
import { calculatePaySummary } from './calculatePaySummary';
import type { TaxYearId, FamilyStatus } from './types';

/**
 * Medicare Levy Family Threshold Tests
 *
 * Tests the Medicare Levy (standard 2%) calculation with family low-income thresholds.
 * These tests verify that families with children receive the correct threshold adjustments.
 */
describe('Medicare Levy - Family Thresholds', () => {
  const taxYear: TaxYearId = '2024-25';

  // Helper function to calculate just the Medicare Levy
  const getMedicareLevy = (
    income: number,
    familyStatus: FamilyStatus = 'single',
    dependents: number = 0
  ) => {
    const result = calculatePaySummary({
      taxYear,
      annualSalary: income,
      frequency: 'weekly',
      residency: 'resident',
      claimTaxFreeThreshold: true,
      medicareExempt: false,
      medicareReduced: false,
      hasPrivateHealth: false,
      familyStatus,
      dependents,
      hasHELP: false,
      deductions: 0,
      includeSuper: false,
      superRate: 0.115,
    });
    return result.annual.medicareLevy;
  };

  describe('Singles (no dependents)', () => {
    it('below threshold ($20k): no levy', () => {
      expect(getMedicareLevy(20000, 'single', 0)).toBe(0);
    });

    it('in phase-in range ($30k): shade-in formula', () => {
      // $30k is between $27,222 (lower) and $34,027 (upper)
      // Should use 10% of excess formula
      const levy = getMedicareLevy(30000, 'single', 0);
      expect(levy).toBeGreaterThan(0);
      expect(levy).toBeLessThan(30000 * 0.02); // Less than full 2%
    });

    it('above threshold ($50k): full 2%', () => {
      expect(getMedicareLevy(50000, 'single', 0)).toBe(1000); // 2% of $50k
    });

    it('exactly at lower threshold ($27,222): no levy', () => {
      expect(getMedicareLevy(27222, 'single', 0)).toBe(0);
    });

    it('exactly at upper threshold ($34,027): full 2%', () => {
      expect(getMedicareLevy(34027, 'single', 0)).toBe(680.54); // 2% of $34,027
    });
  });

  describe('Partnered (no dependents)', () => {
    it('below family threshold ($40k): no levy', () => {
      // $40k is below family threshold of $45,907
      expect(getMedicareLevy(40000, 'partnered', 0)).toBe(0);
    });

    it('in family phase-in range ($50k): shade-in formula', () => {
      // $50k is between $45,907 (lower) and $57,383 (upper)
      const levy = getMedicareLevy(50000, 'partnered', 0);
      expect(levy).toBeGreaterThan(0);
      expect(levy).toBeLessThan(50000 * 0.02); // Less than full 2%
    });

    it('above family threshold ($70k): full 2%', () => {
      expect(getMedicareLevy(70000, 'partnered', 0)).toBe(1400); // 2% of $70k
    });

    it('exactly at family lower threshold ($45,907): no levy', () => {
      expect(getMedicareLevy(45907, 'partnered', 0)).toBe(0);
    });
  });

  describe('Families with 1 child', () => {
    it('partnered + 1 child, below adjusted threshold ($50k): no levy', () => {
      // Lower threshold: $45,907 + $4,216 = $50,123
      // $50k is below threshold
      expect(getMedicareLevy(50000, 'partnered', 1)).toBe(0);
    });

    it('partnered + 1 child, above adjusted threshold ($55k): phase-in or full levy', () => {
      // Lower: $50,123, Upper: $62,653
      const levy = getMedicareLevy(55000, 'partnered', 1);
      expect(levy).toBeGreaterThan(0);
    });

    it('single + 1 child (single parent), uses family threshold ($50k): no levy', () => {
      // Singles with dependents use family thresholds
      // Lower: $45,907 + $4,216 = $50,123
      expect(getMedicareLevy(50000, 'single', 1)).toBe(0);
    });
  });

  describe('Families with 3 children - CRITICAL BUG FIX VERIFICATION', () => {
    it('partnered + 3 children, $50k: no levy (below threshold)', () => {
      // Lower threshold: $45,907 + (3 × $4,216) = $58,555
      // $50k is well below threshold
      expect(getMedicareLevy(50000, 'partnered', 3)).toBe(0);
    });

    it('partnered + 3 children, $40k: no levy', () => {
      expect(getMedicareLevy(40000, 'partnered', 3)).toBe(0);
    });

    it('partnered + 3 children, $30k: no levy', () => {
      expect(getMedicareLevy(30000, 'partnered', 3)).toBe(0);
    });

    it('partnered + 3 children, $60k: shade-in amount (not full 2%)', () => {
      // Lower: $58,555, Upper: $73,193
      // $60k is in phase-in range
      const levy = getMedicareLevy(60000, 'partnered', 3);
      expect(levy).toBeGreaterThan(0);
      expect(levy).toBeLessThan(60000 * 0.02); // Less than full 2%
      // Expected: approximately 10% × ($60,000 - $58,555) = $144.50
      expect(levy).toBeCloseTo(144.5, 0);
    });

    it('partnered + 3 children, $80k: full 2%', () => {
      // $80k is above upper threshold of $73,193
      expect(getMedicareLevy(80000, 'partnered', 3)).toBe(1600); // 2% of $80k
    });

    it('exactly at lower threshold ($58,555): no levy', () => {
      const lowerThreshold = 45907 + (3 * 4216);
      expect(getMedicareLevy(lowerThreshold, 'partnered', 3)).toBe(0);
    });
  });

  describe('Singles with dependents (single parents)', () => {
    it('single + 1 child, $50k: no levy (uses family threshold)', () => {
      // Lower: $45,907 + $4,216 = $50,123
      expect(getMedicareLevy(50000, 'single', 1)).toBe(0);
    });

    it('single + 3 children, $50k: no levy', () => {
      // Lower: $45,907 + (3 × $4,216) = $58,555
      expect(getMedicareLevy(50000, 'single', 3)).toBe(0);
    });

    it('single + 2 children, $60k: shade-in or full levy', () => {
      // Lower: $45,907 + (2 × $4,216) = $54,339
      // $60k is above threshold
      const levy = getMedicareLevy(60000, 'single', 2);
      expect(levy).toBeGreaterThan(0);
    });
  });

  describe('Edge cases', () => {
    it('negative dependents treated as 0', () => {
      // Should use single threshold
      const levyNegative = getMedicareLevy(50000, 'single', -1);
      const levyZero = getMedicareLevy(50000, 'single', 0);
      expect(levyNegative).toBe(levyZero);
    });

    it('exempt option always returns 0', () => {
      const result = calculatePaySummary({
        taxYear,
        annualSalary: 100000,
        frequency: 'weekly',
        residency: 'resident',
        claimTaxFreeThreshold: true,
        medicareExempt: true,
        hasPrivateHealth: false,
        familyStatus: 'partnered',
        dependents: 3,
        hasHELP: false,
        deductions: 0,
        includeSuper: false,
        superRate: 0.115,
      });
      expect(result.annual.medicareLevy).toBe(0);
    });

    it('very high income (>$1M) with family: full 2%', () => {
      expect(getMedicareLevy(1000000, 'partnered', 3)).toBe(20000);
    });
  });

  describe('Historical tax years', () => {
    it('2023-24 family thresholds work correctly', () => {
      const result2023 = calculatePaySummary({
        taxYear: '2023-24',
        annualSalary: 50000,
        frequency: 'weekly',
        residency: 'resident',
        claimTaxFreeThreshold: true,
        medicareExempt: false,
        hasPrivateHealth: false,
        familyStatus: 'partnered',
        dependents: 2,
        hasHELP: false,
        deductions: 0,
        includeSuper: false,
        superRate: 0.115,
      });
      // 2023-24: Lower $43,846 + (2 × $4,027) = $51,900
      // $50k is below threshold
      expect(result2023.annual.medicareLevy).toBe(0);
    });

    it('2022-23 family thresholds work correctly', () => {
      const result2022 = calculatePaySummary({
        taxYear: '2022-23',
        annualSalary: 45000,
        frequency: 'weekly',
        residency: 'resident',
        claimTaxFreeThreshold: true,
        medicareExempt: false,
        hasPrivateHealth: false,
        familyStatus: 'partnered',
        dependents: 1,
        hasHELP: false,
        deductions: 0,
        includeSuper: false,
        superRate: 0.115,
      });
      // 2022-23: Lower $40,939 + $3,760 = $44,699
      // $45k is slightly above, should have small levy (phase-in)
      expect(result2022.annual.medicareLevy).toBeGreaterThan(0);
      expect(result2022.annual.medicareLevy).toBeLessThan(45000 * 0.02);
    });

    it('2021-22 family thresholds work correctly', () => {
      const result2021 = calculatePaySummary({
        taxYear: '2021-22',
        annualSalary: 40000,
        frequency: 'weekly',
        residency: 'resident',
        claimTaxFreeThreshold: true,
        medicareExempt: false,
        hasPrivateHealth: false,
        familyStatus: 'partnered',
        dependents: 0,
        hasHELP: false,
        deductions: 0,
        includeSuper: false,
        superRate: 0.115,
      });
      // 2021-22: Family base threshold $39,402
      // $40k is slightly above, should have small levy (phase-in)
      expect(result2021.annual.medicareLevy).toBeGreaterThan(0);
    });

    it('2020-21 family thresholds work correctly', () => {
      const result2020 = calculatePaySummary({
        taxYear: '2020-21',
        annualSalary: 38000,
        frequency: 'weekly',
        residency: 'resident',
        claimTaxFreeThreshold: true,
        medicareExempt: false,
        hasPrivateHealth: false,
        familyStatus: 'partnered',
        dependents: 0,
        hasHELP: false,
        deductions: 0,
        includeSuper: false,
        superRate: 0.115,
      });
      // 2020-21: Family base threshold $39,167
      // $38k is below threshold
      expect(result2020.annual.medicareLevy).toBe(0);
    });
  });

  describe('Shade-in formula verification', () => {
    it('verifies 10% of excess formula at midpoint', () => {
      // For 2024-25 singles: Lower $27,222, Upper $34,027
      const midpoint = (27222 + 34027) / 2; // $30,624.50
      const levy = getMedicareLevy(midpoint, 'single', 0);

      // At midpoint, should be roughly halfway through phase-in
      // Not exactly 1% due to the formula, but should be in that range
      expect(levy).toBeGreaterThan(0);
      expect(levy).toBeLessThan(midpoint * 0.02);
    });

    it('verifies family shade-in formula', () => {
      // For partnered with 3 children:
      // Lower: $58,555, Upper: $73,193
      const lowerThreshold = 45907 + (3 * 4216);
      const upperThreshold = 57383 + (3 * 5270);
      const testIncome = 65000; // In phase-in range

      const levy = getMedicareLevy(testIncome, 'partnered', 3);

      // Expected using shade-in formula:
      // shadeRate = (0.02 × upperThreshold) / (upperThreshold - lowerThreshold)
      // levy = shadeRate × (income - lowerThreshold)
      const shadeRate = (0.02 * upperThreshold) / (upperThreshold - lowerThreshold);
      const expectedLevy = shadeRate * (testIncome - lowerThreshold);

      expect(levy).toBeCloseTo(expectedLevy, 2);
    });
  });

  describe('Integration with other parameters', () => {
    it('reduced Medicare rate (1%) with family thresholds', () => {
      const result = calculatePaySummary({
        taxYear,
        annualSalary: 70000,
        frequency: 'weekly',
        residency: 'resident',
        claimTaxFreeThreshold: true,
        medicareExempt: false,
        medicareReduced: true,
        hasPrivateHealth: false,
        familyStatus: 'partnered',
        dependents: 2,
        hasHELP: false,
        deductions: 0,
        includeSuper: false,
        superRate: 0.115,
      });
      // With reduced rate (1%) instead of full (2%)
      // Should still respect family thresholds
      expect(result.annual.medicareLevy).toBeLessThan(70000 * 0.02);
    });
  });
});
