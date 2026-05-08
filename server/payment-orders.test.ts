import { describe, it, expect } from "vitest";
import { getDb } from "./db";
import { orders, products } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Payment and Order Workflow", () => {
  it("should create an order with payment method and transaction ID", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const timestamp = Date.now();

    // Create a test product
    await db.insert(products).values({
      name: `Test Product ${timestamp}`,
      price: "99.99",
      isActive: 1,
    });

    // Create order with payment details
    const result = await db.insert(orders).values({
      productId: 1,
      customerName: "Test Customer",
      customerEmail: "test@example.com",
      customerPhone: "+1234567890",
      quantity: 1,
      totalPrice: "99.99",
      status: "pending",
      paymentMethod: "payoneer",
      transactionId: `TXN-TEST-${timestamp}`,
      paymentProofUrl: "https://example.com/proof.jpg",
      invoiceStatus: "pending",
      invoiceNumber: `INV-${timestamp}`,
    });

    expect(result).toBeDefined();
  });

  it("should support all payment methods", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const paymentMethods = [
      "payoneer",
      "paypal",
      "bkash",
      "nagad",
      "rocket",
      "binance",
    ];

    for (const method of paymentMethods) {
      const result = await db.insert(orders).values({
        productId: 1,
        customerName: "Test Customer",
        customerEmail: "test@example.com",
        quantity: 1,
        totalPrice: "99.99",
        status: "pending",
        paymentMethod: method,
        transactionId: `TXN-${method.toUpperCase()}-${Date.now()}`,
        paymentProofUrl: `https://example.com/proof-${method}.jpg`,
        invoiceStatus: "pending",
      });

      expect(result).toBeDefined();
    }
  });

  it("should retrieve orders with payment details", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const timestamp = Date.now();

    // Create order
    await db.insert(orders).values({
      productId: 1,
      customerName: "Test Customer",
      customerEmail: "test@example.com",
      quantity: 1,
      totalPrice: "99.99",
      status: "pending",
      paymentMethod: "binance",
      transactionId: `TXN-BINANCE-${timestamp}`,
      paymentProofUrl: "https://example.com/proof.jpg",
      invoiceStatus: "pending",
    });

    // Retrieve orders
    const allOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.paymentMethod, "binance"));

    expect(Array.isArray(allOrders)).toBe(true);
    expect(allOrders.length).toBeGreaterThan(0);

    const order = allOrders[allOrders.length - 1];
    expect(order.paymentMethod).toBe("binance");
    expect(order.paymentProofUrl).toContain("https://example.com/proof");
  });

  it("should handle payment proof URL storage", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const proofUrl =
      "https://storage.example.com/payment-proofs/1234567890-proof.jpg";
    const timestamp = Date.now();

    // Create order with proof URL
    const result = await db.insert(orders).values({
      productId: 1,
      customerName: "Test Customer",
      customerEmail: "test@example.com",
      quantity: 1,
      totalPrice: "99.99",
      status: "pending",
      paymentMethod: "bkash",
      transactionId: `TXN-BKASH-${timestamp}`,
      paymentProofUrl: proofUrl,
      invoiceStatus: "pending",
    });

    expect(result).toBeDefined();

    // Verify stored URL
    const storedOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.paymentProofUrl, proofUrl));

    expect(storedOrders.length).toBeGreaterThan(0);
    expect(storedOrders[0].paymentProofUrl).toContain("payment-proofs");
  });

  it("should generate invoice number for orders", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const invoiceNumber = `INV-2026-${Date.now()}`;

    // Create order with invoice number
    const result = await db.insert(orders).values({
      productId: 1,
      customerName: "Test Customer",
      customerEmail: "test@example.com",
      quantity: 1,
      totalPrice: "99.99",
      status: "pending",
      paymentMethod: "nagad",
      transactionId: `TXN-NAGAD-${Date.now()}`,
      paymentProofUrl: "https://example.com/proof.jpg",
      invoiceStatus: "pending",
      invoiceNumber: invoiceNumber,
    });

    expect(result).toBeDefined();

    // Verify invoice number
    const storedOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.invoiceNumber, invoiceNumber));

    expect(storedOrders.length).toBeGreaterThan(0);
    expect(storedOrders[0].invoiceNumber).toMatch(/^INV-/);
  });

  it("should track invoice status changes", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const timestamp = Date.now();

    // Create order with pending status
    await db.insert(orders).values({
      productId: 1,
      customerName: "Test Customer",
      customerEmail: "test@example.com",
      quantity: 1,
      totalPrice: "99.99",
      status: "pending",
      paymentMethod: "rocket",
      transactionId: `TXN-ROCKET-${timestamp}`,
      paymentProofUrl: "https://example.com/proof.jpg",
      invoiceStatus: "pending",
    });

    // Retrieve and verify pending status
    const pendingOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.transactionId, `TXN-ROCKET-${timestamp}`));

    expect(pendingOrders.length).toBeGreaterThan(0);
    const pendingOrder = pendingOrders[0];
    expect(pendingOrder.invoiceStatus).toBe("pending");

    // Update to successful
    await db
      .update(orders)
      .set({ invoiceStatus: "successful" })
      .where(eq(orders.id, pendingOrder.id));

    const successOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.id, pendingOrder.id));

    expect(successOrders.length).toBeGreaterThan(0);
    expect(successOrders[0].invoiceStatus).toBe("successful");
  });
});
