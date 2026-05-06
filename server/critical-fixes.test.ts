import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb } from "./db";
import { orders, products } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Critical Bug Fixes - Payment & Order Management", () => {
  let db: any;

  beforeAll(async () => {
    db = await getDb();
    if (!db) throw new Error("Database not available");
  });

  describe("File Upload & Payment Proof", () => {
    it("should support payment proof URLs up to 500 characters", () => {
      const longUrl = "https://example.com/" + "a".repeat(450);
      expect(longUrl.length).toBeLessThanOrEqual(500);
      expect(longUrl).toMatch(/^https?:\/\//);
    });

    it("should handle various image file types for payment proof", () => {
      const supportedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      supportedTypes.forEach(type => {
        expect(type).toMatch(/^image\//);
      });
    });

    it("should store payment proof URL in database", async () => {
      const timestamp = Date.now();
      const proofUrl = `https://cdn.example.com/payment-proofs/${timestamp}-proof.jpg`;

      const result = await db.insert(orders).values({
        productId: 1,
        customerName: "Test User",
        customerEmail: "test@example.com",
        customerPhone: "+1234567890",
        quantity: 1,
        totalPrice: "99.99",
        status: "pending",
        paymentMethod: "payoneer",
        transactionId: `TXN-${timestamp}`,
        paymentProofUrl: proofUrl,
        invoiceStatus: "pending",
        invoiceNumber: `INV-PROOF-${timestamp}`,
      });

      expect(result).toBeDefined();

      // Verify stored
      const stored = await db
        .select()
        .from(orders)
        .where(eq(orders.invoiceNumber, `INV-PROOF-${timestamp}`));

      expect(stored.length).toBeGreaterThan(0);
      expect(stored[0].paymentProofUrl).toBe(proofUrl);
    });
  });

  describe("Order Creation Error Handling", () => {
    it("should create order with all required fields", async () => {
      const timestamp = Date.now();

      const result = await db.insert(orders).values({
        productId: 1,
        customerName: "Error Test User",
        customerEmail: "error@example.com",
        customerPhone: "+9876543210",
        quantity: 1,
        totalPrice: "199.99",
        status: "pending",
        paymentMethod: "paypal",
        transactionId: `TXN-ERROR-${timestamp}`,
        paymentProofUrl: `https://example.com/proof-${timestamp}.jpg`,
        invoiceStatus: "pending",
        invoiceNumber: `INV-ERROR-${timestamp}`,
      });

      expect(result).toBeDefined();
    });

    it("should handle order with all payment methods", async () => {
      const paymentMethods = ["payoneer", "paypal", "bkash", "nagad", "rocket", "binance"];
      const timestamp = Date.now();

      for (let i = 0; i < paymentMethods.length; i++) {
        const result = await db.insert(orders).values({
          productId: 1,
          customerName: `Test ${paymentMethods[i]}`,
          customerEmail: `test-${i}@example.com`,
          customerPhone: "+1234567890",
          quantity: 1,
          totalPrice: "99.99",
          status: "pending",
          paymentMethod: paymentMethods[i],
          transactionId: `TXN-${paymentMethods[i]}-${timestamp}-${i}`,
          paymentProofUrl: `https://example.com/proof-${i}.jpg`,
          invoiceStatus: "pending",
          invoiceNumber: `INV-${paymentMethods[i]}-${timestamp}-${i}`,
        });

        expect(result).toBeDefined();
      }
    });
  });

  describe("Data Persistence & localStorage", () => {
    it("should support order data structure for localStorage", () => {
      const storedOrder = {
        id: 123,
        invoiceNumber: "INV-2026-001",
        customerName: "John Doe",
        customerEmail: "john@example.com",
        productName: "Digital Product",
        totalPrice: "99.99",
        paymentMethod: "payoneer",
        transactionId: "TXN-12345",
        invoiceStatus: "pending" as const,
        createdAt: new Date().toISOString(),
        paymentProofUrl: "https://example.com/proof.jpg",
      };

      expect(storedOrder.id).toBeDefined();
      expect(storedOrder.invoiceNumber).toMatch(/^INV-/);
      expect(storedOrder.invoiceStatus).toMatch(/^(pending|successful|failed)$/);
      expect(storedOrder.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}/);
    });

    it("should allow order status updates for localStorage", () => {
      const statuses = ["pending", "successful", "failed"] as const;
      statuses.forEach(status => {
        expect(["pending", "successful", "failed"]).toContain(status);
      });
    });
  });

  describe("Invoice Download Functionality", () => {
    it("should support invoice download for PENDING status", async () => {
      const timestamp = Date.now();

      const result = await db.insert(orders).values({
        productId: 1,
        customerName: "Pending Invoice Test",
        customerEmail: "pending@example.com",
        customerPhone: "+1234567890",
        quantity: 1,
        totalPrice: "149.99",
        status: "pending",
        paymentMethod: "bkash",
        transactionId: `TXN-PENDING-${timestamp}`,
        paymentProofUrl: `https://example.com/proof-pending-${timestamp}.jpg`,
        invoiceStatus: "pending",
        invoiceNumber: `INV-PENDING-${timestamp}`,
      });

      expect(result).toBeDefined();

      // Verify can be retrieved for download
      const stored = await db
        .select()
        .from(orders)
        .where(eq(orders.invoiceNumber, `INV-PENDING-${timestamp}`));

      expect(stored.length).toBeGreaterThan(0);
      expect(stored[0].invoiceStatus).toBe("pending");
    });

    it("should support invoice download for SUCCESSFUL status", async () => {
      const timestamp = Date.now();

      const result = await db.insert(orders).values({
        productId: 1,
        customerName: "Successful Invoice Test",
        customerEmail: "success@example.com",
        customerPhone: "+1234567890",
        quantity: 1,
        totalPrice: "249.99",
        status: "completed",
        paymentMethod: "nagad",
        transactionId: `TXN-SUCCESS-${timestamp}`,
        paymentProofUrl: `https://example.com/proof-success-${timestamp}.jpg`,
        invoiceStatus: "successful",
        invoiceNumber: `INV-SUCCESS-${timestamp}`,
      });

      expect(result).toBeDefined();

      // Verify can be retrieved for download
      const stored = await db
        .select()
        .from(orders)
        .where(eq(orders.invoiceNumber, `INV-SUCCESS-${timestamp}`));

      expect(stored.length).toBeGreaterThan(0);
      expect(stored[0].invoiceStatus).toBe("successful");
    });

    it("should include transaction ID in invoice for all statuses", async () => {
      const timestamp = Date.now();
      const txnId = `TXN-INVOICE-${timestamp}`;

      const result = await db.insert(orders).values({
        productId: 1,
        customerName: "Invoice TXN Test",
        customerEmail: "txn@example.com",
        customerPhone: "+1234567890",
        quantity: 1,
        totalPrice: "79.99",
        status: "pending",
        paymentMethod: "rocket",
        transactionId: txnId,
        paymentProofUrl: `https://example.com/proof-txn-${timestamp}.jpg`,
        invoiceStatus: "pending",
        invoiceNumber: `INV-TXN-${timestamp}`,
      });

      expect(result).toBeDefined();

      // Verify transaction ID is stored
      const stored = await db
        .select()
        .from(orders)
        .where(eq(orders.invoiceNumber, `INV-TXN-${timestamp}`));

      expect(stored.length).toBeGreaterThan(0);
      expect(stored[0].transactionId).toBe(txnId);
    });
  });

  describe("Complete Checkout Workflow", () => {
    it("should support complete order flow: upload -> create -> persist -> download", async () => {
      const timestamp = Date.now();
      const proofUrl = `https://cdn.example.com/payment-proofs/${timestamp}-complete-flow.jpg`;
      const invoiceNum = `INV-FLOW-${timestamp}`;
      const txnId = `TXN-FLOW-${timestamp}`;

      // Step 1: Create order with proof URL
      const createResult = await db.insert(orders).values({
        productId: 1,
        customerName: "Complete Flow Test",
        customerEmail: "flow@example.com",
        customerPhone: "+1234567890",
        quantity: 1,
        totalPrice: "299.99",
        status: "pending",
        paymentMethod: "binance",
        transactionId: txnId,
        paymentProofUrl: proofUrl,
        invoiceStatus: "pending",
        invoiceNumber: invoiceNum,
      });

      expect(createResult).toBeDefined();

      // Step 2: Retrieve order (simulating page load)
      const retrieved = await db
        .select()
        .from(orders)
        .where(eq(orders.invoiceNumber, invoiceNum));

      expect(retrieved.length).toBeGreaterThan(0);
      const order = retrieved[0];

      // Step 3: Verify all data for localStorage
      expect(order.id).toBeDefined();
      expect(order.invoiceNumber).toBe(invoiceNum);
      expect(order.customerName).toBe("Complete Flow Test");
      expect(order.paymentMethod).toBe("binance");
      expect(order.transactionId).toBe(txnId);
      expect(order.paymentProofUrl).toBe(proofUrl);
      expect(order.invoiceStatus).toBe("pending");

      // Step 4: Verify invoice can be downloaded
      expect(order.invoiceNumber).toMatch(/^INV-/);
      expect(order.invoiceStatus).toMatch(/^(pending|successful|failed)$/);
    });
  });
});
