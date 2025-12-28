import { describe, it, expect } from 'vitest';
import { calculateMedicareSurcharge } from './calculateMedicareSurcharge';
import type { TaxYearId } from './types';

describe('calculateMedicareSurcharge', () => {
  const taxYear: TaxYearId = '2024-25';

  describe('Private health insurance exemption', () => {
    it('should return 0 when taxpayer has private health insurance', () => {
      expect(calculateMedicareSurcharge(taxYear, 50000, true)).toBe(0);
      expect(calculateMedicareSurcharge(taxYear, 100000, true)).toBe(0);
      expect(calculateMedicareSurcharge(taxYear, 120000, true)).toBe(0);
      expect(calculateMedicareSurcharge(taxYear, 200000, true)).toBe(0);
    });
  });

  describe('Income tiers without private health', () => {
    describe('Tier 0: $0 - $97,000 (no surcharge)', () => {
      it('should return 0 for income below threshold', () => {
        expect(calculateMedicareSurcharge(taxYear, 0, false)).toBe(0);
        expect(calculateMedicareSurcharge(taxYear, 50000, false)).toBe(0);
        expect(calculateMedicareSurcharge(taxYear, 90000, false)).toBe(0);
        expect(calculateMedicareSurcharge(taxYear, 96999, false)).toBe(0);
        expect(calculateMedicareSurcharge(taxYear, 97000, false)).toBe(0);
      });
    });

    describe('Tier 1: $97,001 - $113,000 (1% surcharge)', () => {
      it('should calculate 1% surcharge for income in tier 1', () => {
        // Just over threshold
        expect(calculateMedicareSurcharge(taxYear, 97001, false)).toBeCloseTo(
          970.01,
          2
        );

        // Middle of tier
        expect(calculateMedicareSurcharge(taxYear, 100000, false)).toBe(1000);

        // Near top of tier
        expect(calculateMedicareSurcharge(taxYear, 110000, false)).toBe(1100);

        // Exactly at top of tier
        expect(calculateMedicareSurcharge(taxYear, 113000, false)).toBe(1130);
      });
    });

    describe('Tier 2: $113,001 - $151,000 (1.25% surcharge)', () => {
      it('should calculate 1.25% surcharge for income in tier 2', () => {
        // Just over tier 1
        expect(calculateMedicareSurcharge(taxYear, 113001, false)).toBeCloseTo(
          1412.5125,
          2
        );

        // Middle of tier
        expect(calculateMedicareSurcharge(taxYear, 120000, false)).toBe(1500);

        // Near top of tier
        expect(calculateMedicareSurcharge(taxYear, 140000, false)).toBe(1750);

        // Exactly at top of tier
        expect(calculateMedicareSurcharge(taxYear, 151000, false)).toBe(1887.5);
      });
    });

    describe('Tier 3: $151,001+ (1.5% surcharge)', () => {
      it('should calculate 1.5% surcharge for income above threshold', () => {
        // Just over tier 2
        expect(calculateMedicareSurcharge(taxYear, 151001, false)).toBeCloseTo(
          2265.015,
          2
        );

        // Well above threshold
        expect(calculateMedicareSurcharge(taxYear, 160000, false)).toBe(2400);
        expect(calculateMedicareSurcharge(taxYear, 180000, false)).toBe(2700);
        expect(calculateMedicareSurcharge(taxYear, 200000, false)).toBe(3000);
        expect(calculateMedicareSurcharge(taxYear, 500000, false)).toBe(7500);
      });
    });
  });

  describe('Known calculation examples', () => {
    it('should match ATO example calculations', () => {
      // Example 1: Income $90,000, no private health
      // Below threshold, no surcharge
      expect(calculateMedicareSurcharge(taxYear, 90000, false)).toBe(0);

      // Example 2: Income $100,000, no private health
      // Tier 1: 1% of $100,000 = $1,000
      expect(calculateMedicareSurcharge(taxYear, 100000, false)).toBe(1000);

      // Example 3: Income $120,000, no private health
      // Tier 2: 1.25% of $120,000 = $1,500
      expect(calculateMedicareSurcharge(taxYear, 120000, false)).toBe(1500);

      // Example 4: Income $160,000, no private health
      // Tier 3: 1.5% of $160,000 = $2,400
      expect(calculateMedicareSurcharge(taxYear, 160000, false)).toBe(2400);

      // Example 5: Income $100,000, with private health
      // No surcharge
      expect(calculateMedicareSurcharge(taxYear, 100000, true)).toBe(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle exact tier boundaries', () => {
      // Exactly at tier boundaries
      expect(calculateMedicareSurcharge(taxYear, 97000, false)).toBe(0);
      expect(calculateMedicareSurcharge(taxYear, 97001, false)).toBeCloseTo(
        970.01,
        2
      );
      expect(calculateMedicareSurcharge(taxYear, 113000, false)).toBe(1130);
      expect(calculateMedicareSurcharge(taxYear, 113001, false)).toBeCloseTo(
        1412.5125,
        2
      );
      expect(calculateMedicareSurcharge(taxYear, 151000, false)).toBe(1887.5);
      expect(calculateMedicareSurcharge(taxYear, 151001, false)).toBeCloseTo(
        2265.015,
        2
      );
    });

    it('should handle zero income', () => {
      expect(calculateMedicareSurcharge(taxYear, 0, false)).toBe(0);
      expect(calculateMedicareSurcharge(taxYear, 0, true)).toBe(0);
    });

    it('should handle negative income as zero', () => {
      expect(calculateMedicareSurcharge(taxYear, -1000, false)).toBe(0);
      expect(calculateMedicareSurcharge(taxYear, -50000, false)).toBe(0);
    });

    it('should handle non-finite values', () => {
      expect(calculateMedicareSurcharge(taxYear, NaN, false)).toBe(0);
      expect(calculateMedicareSurcharge(taxYear, Infinity, false)).toBe(
        Infinity
      );
      expect(calculateMedicareSurcharge(taxYear, -Infinity, false)).toBe(0);
    });

    it('should handle very large incomes', () => {
      const income = 10000000; // $10 million
      const expected = income * 0.015; // 1.5%
      expect(calculateMedicareSurcharge(taxYear, income, false)).toBe(expected);
    });
  });

  describe('2024-25 tax year (representative year)', () => {
    const year: TaxYearId = '2024-25';

    describe('MLS tiers', () => {
      it('should use correct MLS tiers for 2024-25', () => {
        // Below threshold
        expect(calculateMedicareSurcharge(year, 90000, false)).toBe(0);

        // Tier 1
        expect(calculateMedicareSurcharge(year, 100000, false)).toBe(1000);

        // Tier 2
        expect(calculateMedicareSurcharge(year, 120000, false)).toBe(1500);

        // Tier 3
        expect(calculateMedicareSurcharge(year, 160000, false)).toBe(2400);
      });

      it('should respect private health insurance exemption', () => {
        expect(calculateMedicareSurcharge(year, 100000, true)).toBe(0);
        expect(calculateMedicareSurcharge(year, 200000, true)).toBe(0);
      });
    });
  });

  describe('Return value constraints', () => {
    it('should always return a non-negative number (or Infinity)', () => {
      const testIncomes = [0, 50000, 97000, 100000, 120000, 160000, 500000];

      testIncomes.forEach((income) => {
        const result = calculateMedicareSurcharge(taxYear, income, false);
        expect(result).toBeGreaterThanOrEqual(0);
      });
    });

    it('should return 0 when private health is true, regardless of income', () => {
      const testIncomes = [0, 50000, 97000, 100000, 120000, 160000, 500000];

      testIncomes.forEach((income) => {
        expect(calculateMedicareSurcharge(taxYear, income, true)).toBe(0);
      });
    });
  });

  describe('Surcharge rate calculation', () => {
    it('should apply correct rate for each tier', () => {
      // Tier 0: 0%
      const tier0Income = 90000;
      const tier0Rate = 0;
      expect(calculateMedicareSurcharge(taxYear, tier0Income, false)).toBe(
        tier0Income * tier0Rate
      );

      // Tier 1: 1%
      const tier1Income = 100000;
      const tier1Rate = 0.01;
      expect(calculateMedicareSurcharge(taxYear, tier1Income, false)).toBe(
        tier1Income * tier1Rate
      );

      // Tier 2: 1.25%
      const tier2Income = 120000;
      const tier2Rate = 0.0125;
      expect(calculateMedicareSurcharge(taxYear, tier2Income, false)).toBe(
        tier2Income * tier2Rate
      );

      // Tier 3: 1.5%
      const tier3Income = 160000;
      const tier3Rate = 0.015;
      expect(calculateMedicareSurcharge(taxYear, tier3Income, false)).toBe(
        tier3Income * tier3Rate
      );
    });
  });

  describe('Family status thresholds', () => {
    describe('Single status', () => {
      it('should use $97,000 threshold for singles', () => {
        expect(calculateMedicareSurcharge(taxYear, 96000, false, 'single', 0)).toBe(0);
        expect(calculateMedicareSurcharge(taxYear, 97000, false, 'single', 0)).toBe(0);
        expect(calculateMedicareSurcharge(taxYear, 100000, false, 'single', 0)).toBe(1000);
      });

      it('should use family threshold for single parents (single + dependents)', () => {
        // ATO Rule: Singles with dependents are single parents and use family threshold
        // For 2024-25: family base $194k + (5-1)*$1.5k = $200k effective threshold
        expect(calculateMedicareSurcharge(taxYear, 96000, false, 'single', 5)).toBe(0); // Below $200k threshold
        expect(calculateMedicareSurcharge(taxYear, 100000, false, 'single', 5)).toBe(0); // Below $200k threshold
        expect(calculateMedicareSurcharge(taxYear, 205000, false, 'single', 5)).toBe(2050); // Above $200k threshold, 1% tier
      });
    });

    describe('Partnered status', () => {
      it('should use $194,000 base threshold for partnered without dependents', () => {
        expect(calculateMedicareSurcharge(taxYear, 190000, false, 'partnered', 0)).toBe(0);
        expect(calculateMedicareSurcharge(taxYear, 194000, false, 'partnered', 0)).toBe(0);
        expect(calculateMedicareSurcharge(taxYear, 200000, false, 'partnered', 0)).toBe(2000); // 1%
      });

      it('should add $1,500 per dependent after the first for partnered', () => {
        // 1 dependent: threshold = $194,000 (no addition for first child)
        expect(calculateMedicareSurcharge(taxYear, 193000, false, 'partnered', 1)).toBe(0);
        expect(calculateMedicareSurcharge(taxYear, 194000, false, 'partnered', 1)).toBe(0);
        expect(calculateMedicareSurcharge(taxYear, 195000, false, 'partnered', 1)).toBeCloseTo(1950, 0);

        // 2 dependents: threshold = $195,500 (family + $1,500)
        expect(calculateMedicareSurcharge(taxYear, 195000, false, 'partnered', 2)).toBe(0);
        expect(calculateMedicareSurcharge(taxYear, 195500, false, 'partnered', 2)).toBe(0);
        expect(calculateMedicareSurcharge(taxYear, 196000, false, 'partnered', 2)).toBeCloseTo(1960, 0);

        // 5 dependents: threshold = $200,000 (family + 4 × $1,500)
        expect(calculateMedicareSurcharge(taxYear, 200000, false, 'partnered', 5)).toBe(0);
        expect(calculateMedicareSurcharge(taxYear, 201000, false, 'partnered', 5)).toBeCloseTo(2010, 0);
      });
    });

    describe('Single with dependents (single parents)', () => {
      it('should use $97,000 base threshold for singles with no dependents', () => {
        expect(calculateMedicareSurcharge(taxYear, 90000, false, 'single', 0)).toBe(0);
        expect(calculateMedicareSurcharge(taxYear, 97000, false, 'single', 0)).toBe(0);
        expect(calculateMedicareSurcharge(taxYear, 100000, false, 'single', 0)).toBe(1000);
      });

      it('should use family threshold for singles with 1+ dependents', () => {
        // 1 dependent: threshold = $194,000 (family threshold, no addition for first child)
        expect(calculateMedicareSurcharge(taxYear, 193000, false, 'single', 1)).toBe(0);
        expect(calculateMedicareSurcharge(taxYear, 194000, false, 'single', 1)).toBe(0);
        expect(calculateMedicareSurcharge(taxYear, 195000, false, 'single', 1)).toBeCloseTo(1950, 0);

        // 2 dependents: threshold = $195,500 (family + $1,500 for second child)
        expect(calculateMedicareSurcharge(taxYear, 195500, false, 'single', 2)).toBe(0);
        expect(calculateMedicareSurcharge(taxYear, 196000, false, 'single', 2)).toBeCloseTo(1960, 0);

        // 3 dependents: threshold = $197,000 (family + 2 × $1,500)
        expect(calculateMedicareSurcharge(taxYear, 197000, false, 'single', 3)).toBe(0);
        expect(calculateMedicareSurcharge(taxYear, 198000, false, 'single', 3)).toBeCloseTo(1980, 0);
      });
    });
  });

  describe('Tier boundary scaling for families', () => {
    it('should scale tier boundaries proportionally for families', () => {
      // Partnered with 2 kids: threshold = $200,000, scale = 200,000 / 97,000 ≈ 2.062
      // Tier 1 scaled: ~$200,014 - $233,006 at 1%
      const income = 205000;
      const surcharge = calculateMedicareSurcharge(taxYear, income, false, 'partnered', 2);
      expect(surcharge).toBeCloseTo(income * 0.01, 0); // 1% tier
    });

    it('should apply correct tier rates after scaling', () => {
      // Family threshold = $194,000, scale factor = 2.0
      // Scaled tier 2: ~$226,000 - $302,000 at 1.25%
      const income = 240000;
      const surcharge = calculateMedicareSurcharge(taxYear, income, false, 'partnered', 0);
      expect(surcharge).toBeCloseTo(income * 0.0125, 0); // 1.25% tier

      // Scaled tier 3: >$302,000 at 1.5%
      const highIncome = 320000;
      const highSurcharge = calculateMedicareSurcharge(taxYear, highIncome, false, 'partnered', 0);
      expect(highSurcharge).toBeCloseTo(highIncome * 0.015, 0); // 1.5% tier
    });
  });

  describe('ATO example calculations with families', () => {
    it('should match ATO examples for couples', () => {
      // Example: Couple with 2 children, income $196,000, no PHI
      // Threshold: $194,000 + (1 × $1,500) = $195,500 (first child free, second adds $1,500)
      // Income $196,000 is in Tier 1 (scaled): 1% surcharge
      const surcharge = calculateMedicareSurcharge('2024-25', 196000, false, 'partnered', 2);
      expect(surcharge).toBe(1960); // 1% of $196,000
    });

    it('should match examples for singles with dependents', () => {
      // Example: Single with 1 child, income $194,000, no PHI
      // Threshold: $194,000 (family threshold, first child free)
      // Exactly at threshold: no surcharge
      expect(calculateMedicareSurcharge('2024-25', 194000, false, 'single', 1)).toBe(0);

      // $1 over threshold: enters tier 1
      const surcharge = calculateMedicareSurcharge('2024-25', 194001, false, 'single', 1);
      expect(surcharge).toBeCloseTo(1940.01, 0); // ~1% of $194,001
    });

    it('should handle high-income families correctly', () => {
      // Couple with 3 children, income $320,000, no PHI
      // Threshold: $194,000 + (2 × $1,500) = $197,000 (first child free, 2nd and 3rd add $1,500 each)
      // Well into tier 3 (scaled): 1.5% surcharge
      const surcharge = calculateMedicareSurcharge('2024-25', 320000, false, 'partnered', 3);
      expect(surcharge).toBeCloseTo(4800, 0); // 1.5% of $320,000
    });
  });

  describe('Edge cases with family status', () => {
    it('should handle negative dependents as zero', () => {
      expect(calculateMedicareSurcharge(taxYear, 200000, false, 'partnered', -5))
        .toBe(calculateMedicareSurcharge(taxYear, 200000, false, 'partnered', 0));
    });

    it('should handle zero dependents correctly', () => {
      expect(calculateMedicareSurcharge(taxYear, 200000, false, 'partnered', 0)).toBe(2000);
      expect(calculateMedicareSurcharge(taxYear, 97001, false, 'single', 0)).toBeCloseTo(970.01, 2);
    });

    it('should handle large number of dependents', () => {
      // 10 dependents: threshold = $194,000 + (9 × $1,500) = $207,500
      expect(calculateMedicareSurcharge(taxYear, 207500, false, 'partnered', 10)).toBe(0);
      expect(calculateMedicareSurcharge(taxYear, 208000, false, 'partnered', 10)).toBeCloseTo(2080, 0);
    });

    it('should respect PHI exemption regardless of family status', () => {
      expect(calculateMedicareSurcharge(taxYear, 200000, true, 'partnered', 2)).toBe(0);
      expect(calculateMedicareSurcharge(taxYear, 200000, true, 'single', 1)).toBe(0);
      expect(calculateMedicareSurcharge(taxYear, 320000, true, 'partnered', 5)).toBe(0);
    });
  });

  describe('Backward compatibility - default parameters', () => {
    it('should default to single status when familyStatus not provided', () => {
      // These should behave exactly like the old function signature
      expect(calculateMedicareSurcharge(taxYear, 90000, false)).toBe(0);
      expect(calculateMedicareSurcharge(taxYear, 100000, false)).toBe(1000);
      expect(calculateMedicareSurcharge(taxYear, 120000, false)).toBe(1500);
    });

    it('should default to zero dependents when not provided', () => {
      expect(calculateMedicareSurcharge(taxYear, 200000, false, 'partnered')).toBe(2000);
      expect(calculateMedicareSurcharge(taxYear, 100000, false, 'single')).toBe(1000);
    });
  });

  describe('Family status for 2024-25', () => {
    const year: TaxYearId = '2024-25';

    describe('2024-25 family thresholds', () => {
      it('should use family thresholds correctly', () => {
        // Single threshold ($97,000 for 2024-25)
        expect(calculateMedicareSurcharge(year, 97000, false, 'single', 0)).toBe(0);
        expect(calculateMedicareSurcharge(year, 100000, false, 'single', 0)).toBe(1000);

        // Family threshold ($194,000 for 2024-25)
        expect(calculateMedicareSurcharge(year, 194000, false, 'partnered', 0)).toBe(0);
        expect(calculateMedicareSurcharge(year, 200000, false, 'partnered', 0)).toBe(2000);

        // With dependents ($194k + $1.5k for 2nd child = $195.5k threshold)
        expect(calculateMedicareSurcharge(year, 195000, false, 'partnered', 2)).toBe(0); // Below $195.5k threshold
        expect(calculateMedicareSurcharge(year, 200000, false, 'partnered', 2)).toBe(2000); // Above threshold, 1% tier
        expect(calculateMedicareSurcharge(year, 205000, false, 'partnered', 2)).toBe(2050); // Above threshold, 1% tier
      });
    });
  });
});
