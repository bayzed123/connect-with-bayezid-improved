import { describe, it, expect } from "vitest";
import { getDb } from "./db";
import { products, orders } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Products and Orders System", () => {
  describe("Product Management", () => {
    it("should create a product with minimal data", async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .insert(products)
        .values({
          name: `Test Product ${Date.now()}`,
          price: "99.99",
          isActive: 1,
        });

      expect(result).toBeDefined();
    });

    it("should create a product with full details", async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .insert(products)
        .values({
          name: `Premium Service ${Date.now()}`,
          description: "A comprehensive service package",
          category: "Coding",
          price: "299.99",
          discountPrice: "199.99",
          image: "https://example.com/image.jpg",
          isActive: 1,
        });

      expect(result).toBeDefined();
    });

    it("should retrieve active products", async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const activeProducts = await db
        .select()
        .from(products)
        .where(eq(products.isActive, 1));

      expect(Array.isArray(activeProducts)).toBe(true);
      expect(activeProducts.length).toBeGreaterThan(0);
    });

    it("should retrieve products by category", async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Create a product with a specific category
      const timestamp = Date.now();
      await db.insert(products).values({
        name: `Coding Service ${timestamp}`,
        category: "Coding",
        price: "150.00",
        isActive: 1,
      });

      // Retrieve products with that category
      const codingProducts = await db
        .select()
        .from(products)
        .where(eq(products.category, "Coding"));

      expect(Array.isArray(codingProducts)).toBe(true);
    });

    it("should retrieve products with discount pricing", async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const timestamp = Date.now();
      await db.insert(products).values({
        name: `Discounted Product ${timestamp}`,
        price: "100.00",
        discountPrice: "75.00",
        isActive: 1,
      });

      const allProducts = await db.select().from(products);
      const discountedProducts = allProducts.filter((p: any) => p.discountPrice);

      expect(discountedProducts.length).toBeGreaterThan(0);
    });
  });

  describe("Order Management", () => {
    it("should create an order with pending status", async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // First create a product
      const timestamp = Date.now();
      const productResult = await db
        .insert(products)
        .values({
          name: `Order Test Product ${timestamp}`,
          price: "50.00",
          isActive: 1,
        });

      // Get the product ID from the insert result
      const allProducts = await db.select().from(products);
      const testProduct = allProducts[allProducts.length - 1];

      // Create an order
      const result = await db.insert(orders).values({
        productId: testProduct.id,
        customerName: "John Doe",
        customerEmail: `john${timestamp}@example.com`,
        customerPhone: "+1234567890",
        quantity: 2,
        totalPrice: "100.00",
        status: "pending",
      });

      expect(result).toBeDefined();
    });

    it("should create an order with minimal data", async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get an existing product
      const allProducts = await db.select().from(products);
      const testProduct = allProducts[0];

      const timestamp = Date.now();
      const result = await db.insert(orders).values({
        productId: testProduct.id,
        customerName: "Jane Smith",
        customerEmail: `jane${timestamp}@example.com`,
        quantity: 1,
        totalPrice: "50.00",
        status: "pending",
      });

      expect(result).toBeDefined();
    });

    it("should retrieve all orders", async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const allOrders = await db.select().from(orders);

      expect(Array.isArray(allOrders)).toBe(true);
    });

    it("should retrieve orders by status", async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const allOrders = await db.select().from(orders);
      const pendingOrders = allOrders.filter((o: any) => o.status === "pending");

      expect(Array.isArray(pendingOrders)).toBe(true);
    });

    it("should calculate total revenue from orders", async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const allOrders = await db.select().from(orders);

      const totalRevenue = allOrders.reduce((sum: number, order: any) => {
        return sum + parseFloat(order.totalPrice);
      }, 0);

      expect(typeof totalRevenue).toBe("number");
      expect(totalRevenue).toBeGreaterThanOrEqual(0);
    });

    it("should count orders by status", async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const allOrders = await db.select().from(orders);

      const statusCounts = allOrders.reduce(
        (acc: any, order: any) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      expect(typeof statusCounts).toBe("object");
    });
  });

  describe("Product-Order Relationship", () => {
    it("should verify products and orders exist", async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const allProducts = await db.select().from(products);
      const allOrders = await db.select().from(orders);

      expect(Array.isArray(allProducts)).toBe(true);
      expect(Array.isArray(allOrders)).toBe(true);
    });

    it("should verify order product IDs reference existing products", async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const allProducts = await db.select().from(products);
      const allOrders = await db.select().from(orders);

      const productIds = allProducts.map((p: any) => p.id);

      for (const order of allOrders) {
        expect(productIds).toContain(order.productId);
      }
    });
  });
});
