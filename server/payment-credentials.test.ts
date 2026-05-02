import { describe, it, expect } from "vitest";

/**
 * Payment Credentials Validation Tests
 * Verifies that all payment method credentials are properly configured
 */

describe("Payment Credentials Configuration", () => {
  describe("Payoneer Configuration", () => {
    it("should have PAYONEER_EMAIL environment variable set", () => {
      const email = process.env.PAYONEER_EMAIL;
      expect(email).toBeDefined();
      expect(email).toBe("cwb.agency@outlook.com");
      expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/); // Email format validation
    });
  });

  describe("PayPal Configuration", () => {
    it("should have PAYPAL_EMAIL environment variable set", () => {
      const email = process.env.PAYPAL_EMAIL;
      expect(email).toBeDefined();
      expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/); // Email format validation
    });

    it("should have PAYPAL_MERCHANT_ID environment variable set", () => {
      const merchantId = process.env.PAYPAL_MERCHANT_ID;
      expect(merchantId).toBeDefined();
      expect(merchantId).toHaveLength(13); // PayPal Merchant IDs are typically 13 chars
    });
  });

  describe("Bkash Configuration", () => {
    it("should have BKASH_NUMBER environment variable set", () => {
      const number = process.env.BKASH_NUMBER;
      expect(number).toBeDefined();
      expect(number).toMatch(/^01[0-9]{9}$/); // Bangladesh phone format
      expect(number).toBe("01791527854");
    });
  });

  describe("Nagad Configuration", () => {
    it("should have NAGAD_NUMBER environment variable set", () => {
      const number = process.env.NAGAD_NUMBER;
      expect(number).toBeDefined();
      expect(number).toMatch(/^01[0-9]{9}$/); // Bangladesh phone format
      expect(number).toBe("01519601517");
    });
  });

  describe("Rocket Configuration", () => {
    it("should have ROCKET_NUMBER environment variable set", () => {
      const number = process.env.ROCKET_NUMBER;
      expect(number).toBeDefined();
      expect(number).toMatch(/^01[0-9]{9}$/); // Bangladesh phone format
      expect(number).toBe("01519601517");
    });
  });

  describe("Binance Configuration", () => {
    it("should have BINANCE_ID environment variable set", () => {
      const binanceId = process.env.BINANCE_ID;
      expect(binanceId).toBeDefined();
      expect(binanceId).toBe("1157359156");
      expect(binanceId).toMatch(/^[0-9]+$/); // Should be numeric
    });
  });

  describe("All Payment Methods Available", () => {
    it("should have at least one payment method configured", () => {
      const paymentMethods = [
        process.env.PAYONEER_EMAIL,
        process.env.PAYPAL_EMAIL,
        process.env.BKASH_NUMBER,
        process.env.NAGAD_NUMBER,
        process.env.ROCKET_NUMBER,
        process.env.BINANCE_ID,
      ];

      const configuredMethods = paymentMethods.filter((m) => m !== undefined);
      expect(configuredMethods.length).toBeGreaterThanOrEqual(1);
    });

    it("should have all payment methods configured", () => {
      const paymentMethods = {
        payoneer: process.env.PAYONEER_EMAIL,
        paypal: process.env.PAYPAL_EMAIL,
        bkash: process.env.BKASH_NUMBER,
        nagad: process.env.NAGAD_NUMBER,
        rocket: process.env.ROCKET_NUMBER,
        binance: process.env.BINANCE_ID,
      };

      Object.entries(paymentMethods).forEach(([method, value]) => {
        expect(value).toBeDefined(`${method} should be configured`);
      });
    });
  });

  describe("Payment Method Validation", () => {
    it("should validate Bangladesh mobile numbers format", () => {
      const bdNumbers = [
        process.env.BKASH_NUMBER,
        process.env.NAGAD_NUMBER,
        process.env.ROCKET_NUMBER,
      ];

      bdNumbers.forEach((number) => {
        expect(number).toMatch(/^01[0-9]{9}$/);
        expect(number).toHaveLength(11);
      });
    });

    it("should validate email addresses format", () => {
      const emails = [process.env.PAYONEER_EMAIL, process.env.PAYPAL_EMAIL];

      emails.forEach((email) => {
        expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });
    });

    it("should validate Binance ID format", () => {
      const binanceId = process.env.BINANCE_ID;
      expect(binanceId).toMatch(/^[0-9]+$/);
      expect(binanceId?.length).toBeGreaterThan(0);
    });
  });
});
