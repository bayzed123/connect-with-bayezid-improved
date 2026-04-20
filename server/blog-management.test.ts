import { describe, it, expect } from "vitest";
import { createBlogPost, getBlogPosts, updateBlogPost, deleteBlogPost } from "./db";

describe("Blog Management Admin Features", () => {
  const testBlogData = {
    slug: `admin-test-${Date.now()}`,
    title: "Admin Test Blog",
    content: "This is a test blog for admin management features",
    category: "Technology",
    author: "Test Admin",
    excerpt: "Test excerpt for admin",
    isPublished: 1,
  };

  it("should create a blog post", async () => {
    const blog = await createBlogPost(testBlogData);
    expect(blog).toBeDefined();
    expect(blog.title).toBe("Admin Test Blog");
    expect(blog.id).toBeGreaterThan(0);
  });

  it("should retrieve all blogs for admin view", async () => {
    const allBlogs = await getBlogPosts();
    expect(Array.isArray(allBlogs)).toBe(true);
    expect(allBlogs.length).toBeGreaterThan(0);
  });

  it("should toggle blog from published to draft", async () => {
    const blog = await createBlogPost({
      ...testBlogData,
      slug: `toggle-test-${Date.now()}`,
      isPublished: 1,
    });

    const updated = await updateBlogPost(blog.id, {
      isPublished: 0,
    });

    expect(updated.isPublished).toBe(0);
  });

  it("should toggle blog from draft to published", async () => {
    const blog = await createBlogPost({
      ...testBlogData,
      slug: `toggle-pub-${Date.now()}`,
      isPublished: 0,
    });

    const updated = await updateBlogPost(blog.id, {
      isPublished: 1,
    });

    expect(updated.isPublished).toBe(1);
  });

  it("should delete a blog post", async () => {
    const blog = await createBlogPost({
      ...testBlogData,
      slug: `delete-test-${Date.now()}`,
    });

    const result = await deleteBlogPost(blog.id);
    expect(result).toBeDefined();
  });

  it("should update blog title and content", async () => {
    const blog = await createBlogPost({
      ...testBlogData,
      slug: `update-test-${Date.now()}`,
    });

    const updated = await updateBlogPost(blog.id, {
      title: "Updated Title",
      content: "Updated content here",
    });

    expect(updated.title).toBe("Updated Title");
    expect(updated.content).toBe("Updated content here");
  });

  it("should handle multiple blog status changes", async () => {
    const blog = await createBlogPost({
      ...testBlogData,
      slug: `multi-toggle-${Date.now()}`,
      isPublished: 1,
    });

    // Toggle to draft
    let updated = await updateBlogPost(blog.id, { isPublished: 0 });
    expect(updated.isPublished).toBe(0);

    // Toggle back to published
    updated = await updateBlogPost(blog.id, { isPublished: 1 });
    expect(updated.isPublished).toBe(1);

    // Toggle to draft again
    updated = await updateBlogPost(blog.id, { isPublished: 0 });
    expect(updated.isPublished).toBe(0);
  });
});
