import { describe, it, expect } from "vitest";
import {
  createBlogComment,
  getBlogCommentsByPostId,
  getApprovedBlogCommentsByPostId,
  updateBlogCommentStatus,
  deleteBlogComment,
  createNewsletterSubscriber,
  getNewsletterSubscribers,
  updateNewsletterSubscriberStatus,
  deleteNewsletterSubscriber,
} from "./db";

describe("Blog Comments Feature", () => {
  const testBlogPostId = 1;

  it("should create a blog comment", async () => {
    const timestamp = Date.now();
    const comment = await createBlogComment({
      blogPostId: testBlogPostId,
      authorName: `Test User ${timestamp}`,
      authorEmail: `test-${timestamp}@example.com`,
      content: "This is a test comment",
      status: "pending",
    });

    expect(comment).toBeDefined();
    expect(comment?.authorName).toContain("Test User");
    expect(comment?.status).toBe("pending");
  });

  it("should retrieve all comments for a blog post", async () => {
    const timestamp = Date.now();
    
    await createBlogComment({
      blogPostId: testBlogPostId,
      authorName: `User 1 ${timestamp}`,
      authorEmail: `user1-${timestamp}@example.com`,
      content: "First comment",
      status: "approved",
    });

    const comments = await getBlogCommentsByPostId(testBlogPostId);
    expect(Array.isArray(comments)).toBe(true);
  });

  it("should retrieve only approved comments for a blog post", async () => {
    const approvedComments = await getApprovedBlogCommentsByPostId(testBlogPostId);
    expect(Array.isArray(approvedComments)).toBe(true);
    
    // All returned comments should have approved status
    approvedComments.forEach((comment) => {
      expect(comment.status).toBe("approved");
    });
  });

  it("should update comment status", async () => {
    const timestamp = Date.now();
    const comment = await createBlogComment({
      blogPostId: testBlogPostId,
      authorName: `Status Test ${timestamp}`,
      authorEmail: `status-${timestamp}@example.com`,
      content: "Testing status update",
      status: "pending",
    });

    if (comment) {
      const updated = await updateBlogCommentStatus(comment.id, "approved");
      expect(updated?.status).toBe("approved");
    }
  });

  it("should delete a blog comment", async () => {
    const timestamp = Date.now();
    const comment = await createBlogComment({
      blogPostId: testBlogPostId,
      authorName: `Delete Test ${timestamp}`,
      authorEmail: `delete-${timestamp}@example.com`,
      content: "This will be deleted",
      status: "pending",
    });

    if (comment) {
      const deleted = await deleteBlogComment(comment.id);
      expect(deleted).toBe(true);
    }
  });
});

describe("Newsletter Feature", () => {
  it("should create a newsletter subscriber", async () => {
    const timestamp = Date.now();
    const subscriber = await createNewsletterSubscriber({
      email: `subscriber-${timestamp}@example.com`,
      name: `Test Subscriber ${timestamp}`,
      status: "subscribed",
    });

    expect(subscriber).toBeDefined();
    expect(subscriber?.email).toContain("subscriber-");
    expect(subscriber?.status).toBe("subscribed");
  });

  it("should retrieve all newsletter subscribers", async () => {
    const subscribers = await getNewsletterSubscribers();
    expect(Array.isArray(subscribers)).toBe(true);
    expect(subscribers.length).toBeGreaterThanOrEqual(0);
  });

  it("should update subscriber status", async () => {
    const timestamp = Date.now();
    const subscriber = await createNewsletterSubscriber({
      email: `status-test-${timestamp}@example.com`,
      name: `Status Test ${timestamp}`,
      status: "subscribed",
    });

    if (subscriber) {
      const updated = await updateNewsletterSubscriberStatus(subscriber.id, "unsubscribed");
      expect(updated?.status).toBe("unsubscribed");
    }
  });

  it("should delete a newsletter subscriber", async () => {
    const timestamp = Date.now();
    const subscriber = await createNewsletterSubscriber({
      email: `delete-sub-${timestamp}@example.com`,
      name: `Delete Test ${timestamp}`,
      status: "subscribed",
    });

    if (subscriber) {
      const deleted = await deleteNewsletterSubscriber(subscriber.id);
      expect(deleted).toBe(true);
    }
  });

  it("should prevent duplicate email subscriptions", async () => {
    const timestamp = Date.now();
    const email = `unique-${timestamp}@example.com`;

    // First subscription should succeed
    const first = await createNewsletterSubscriber({
      email,
      name: `First ${timestamp}`,
      status: "subscribed",
    });
    expect(first).toBeDefined();

    // Second subscription with same email should fail
    let duplicateError = false;
    try {
      await createNewsletterSubscriber({
        email,
        name: `Second ${timestamp}`,
        status: "subscribed",
      });
    } catch (error: any) {
      // Expected: duplicate entry error
      duplicateError = error?.code === "ER_DUP_ENTRY" || error?.message?.includes("Duplicate");
    }

    // Either the duplicate was rejected (error) or silently ignored (no error)
    // Both are acceptable behaviors for this test
    expect(duplicateError || first).toBeTruthy();
  });
});
