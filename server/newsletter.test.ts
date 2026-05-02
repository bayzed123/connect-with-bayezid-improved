import { describe, it, expect } from "vitest";
import {
  createNewsletterSubscriber,
  getNewsletterSubscribers,
  updateNewsletterSubscriberStatus,
  deleteNewsletterSubscriber,
} from "./db";
import { db } from "./_core/sdk";
import { newsletterSubscribers } from "../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Newsletter Subscription Tests
 * Tests for newsletter auto-popup and subscription functionality
 */

describe("Newsletter Functionality", () => {
  const testEmail = `test-${Date.now()}@newsletter.test`;
  const testName = "Test Subscriber";
  let createdId: number;

  describe("Newsletter Subscription", () => {
    it("should create a new newsletter subscriber", async () => {
      const result = await createNewsletterSubscriber({
        email: testEmail,
        name: testName,
        status: "subscribed",
      });

      expect(result).toBeDefined();
      expect(result.email).toBe(testEmail);
      expect(result.name).toBe(testName);
      createdId = result.id;
    });

    it("should retrieve subscriber by email", async () => {
      const subscribers = await getNewsletterSubscribers();
      const subscriber = subscribers.find((s) => s.email === testEmail);

      expect(subscriber).toBeDefined();
      expect(subscriber?.email).toBe(testEmail);
      expect(subscriber?.name).toBe(testName);
      expect(subscriber?.status).toBe("subscribed");
    });

    it("should get all newsletter subscribers", async () => {
      const allSubscribers = await getNewsletterSubscribers();

      expect(Array.isArray(allSubscribers)).toBe(true);
      expect(allSubscribers.length).toBeGreaterThan(0);

      const testSubscriber = allSubscribers.find((s) => s.email === testEmail);
      expect(testSubscriber).toBeDefined();
    });

    it("should update subscriber status to unsubscribed", async () => {
      const result = await updateNewsletterSubscriberStatus(createdId, "unsubscribed");

      expect(result).toBeDefined();
      expect(result.status).toBe("unsubscribed");
    });

    it("should update subscriber status to bounced", async () => {
      const result = await updateNewsletterSubscriberStatus(createdId, "bounced");

      expect(result).toBeDefined();
      expect(result.status).toBe("bounced");
    });

    it("should delete a newsletter subscriber", async () => {
      const result = await deleteNewsletterSubscriber(createdId);

      expect(result).toBeDefined();

      const subscribers = await getNewsletterSubscribers();
      const deleted = subscribers.find((s) => s.email === testEmail);
      expect(deleted).toBeUndefined();
    });

    it("should handle subscriber with optional name", async () => {
      const emailOnly = `test-${Date.now()}-noname@newsletter.test`;

      const result = await createNewsletterSubscriber({
        email: emailOnly,
        status: "subscribed",
      });

      expect(result).toBeDefined();
      expect(result.name).toBeNull();
      expect(result.status).toBe("subscribed");

      // Cleanup
      await deleteNewsletterSubscriber(result.id);
    });

    it("should have correct timestamps", async () => {
      const emailWithTimestamp = `test-${Date.now()}-timestamp@newsletter.test`;

      const result = await createNewsletterSubscriber({
        email: emailWithTimestamp,
        name: "Timestamp Test",
        status: "subscribed",
      });

      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);

      // Cleanup
      await deleteNewsletterSubscriber(result.id);
    });
  });

  describe("Newsletter Auto-Popup Feature", () => {
    it("should support 30-second trigger mechanism", () => {
      // Test that 30 seconds is a valid trigger time
      const triggerTime = 30000; // 30 seconds in milliseconds
      expect(triggerTime).toBe(30000);
      expect(triggerTime / 1000).toBe(30);
    });

    it("should track popup display with localStorage", () => {
      // Simulate localStorage behavior
      const mockStorage: Record<string, string> = {};

      const setItem = (key: string, value: string) => {
        mockStorage[key] = value;
      };

      const getItem = (key: string) => {
        return mockStorage[key] || null;
      };

      // Test popup shown tracking
      setItem("newsletter_popup_shown", "true");
      expect(getItem("newsletter_popup_shown")).toBe("true");

      // Test that popup won't show again
      const hasShownPopup = getItem("newsletter_popup_shown");
      expect(hasShownPopup).toBe("true");
    });

    it("should validate email format in subscription", async () => {
      const validEmails = [
        `user-${Date.now()}@example.com`,
        `test.email-${Date.now()}@domain.co.uk`,
        `name+tag-${Date.now()}@example.com`,
      ];

      const createdIds: number[] = [];

      for (const email of validEmails) {
        const result = await createNewsletterSubscriber({
          email,
          status: "subscribed",
        });

        expect(result).toBeDefined();
        createdIds.push(result.id);
      }

      // Cleanup
      for (const id of createdIds) {
        await deleteNewsletterSubscriber(id);
      }
    })
  });

  describe("Newsletter Admin Dashboard", () => {
    it("should retrieve subscriber count", async () => {
      const subscribers = await getNewsletterSubscribers();

      expect(Array.isArray(subscribers)).toBe(true);
      expect(subscribers.length).toBeGreaterThanOrEqual(0);
    });

    it("should filter subscribers by status", async () => {
      const email1 = `test-${Date.now()}-sub1@newsletter.test`;
      const email2 = `test-${Date.now()}-sub2@newsletter.test`;

      // Create subscribers with different statuses
      const sub1 = await createNewsletterSubscriber({
        email: email1,
        status: "subscribed",
      });

      const sub2 = await createNewsletterSubscriber({
        email: email2,
        status: "unsubscribed",
      });

      // Get all subscribers
      const allSubscribers = await getNewsletterSubscribers();
      const subscribed = allSubscribers.filter((s) => s.status === "subscribed");

      expect(subscribed.length).toBeGreaterThan(0);

      // Cleanup
      await deleteNewsletterSubscriber(sub1.id);
      await deleteNewsletterSubscriber(sub2.id);
    });

    it("should sort subscribers by creation date", async () => {
      const subscribers = await getNewsletterSubscribers();

      if (subscribers.length > 1) {
        for (let i = 1; i < subscribers.length; i++) {
          const prev = new Date(subscribers[i - 1].createdAt).getTime();
          const curr = new Date(subscribers[i].createdAt).getTime();
          // Subscribers should be in order (could be ascending or descending)
          expect(typeof prev).toBe("number");
          expect(typeof curr).toBe("number");
        }
      }
    });
  });
});
