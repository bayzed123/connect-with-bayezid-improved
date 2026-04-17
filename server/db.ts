import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, contactSubmissions, InsertContactSubmission, ContactSubmission, newsItems, InsertNewsItem, NewsItem, blogPosts, InsertBlogPost, BlogPost, clientReviews, InsertClientReview, ClientReview, notifications, InsertNotification, Notification, visitorAnalytics, InsertVisitorAnalytics, VisitorAnalytics } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createContactSubmission(data: InsertContactSubmission): Promise<ContactSubmission | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create contact submission: database not available");
    return null;
  }

  try {
    const result = await db.insert(contactSubmissions).values(data);
    const id = result[0].insertId as number;
    const submissions = await db.select().from(contactSubmissions).where(eq(contactSubmissions.id, id)).limit(1);
    return submissions.length > 0 ? submissions[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create contact submission:", error);
    throw error;
  }
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get contact submissions: database not available");
    return [];
  }

  try {
    return await db.select().from(contactSubmissions).orderBy(contactSubmissions.createdAt);
  } catch (error) {
    console.error("[Database] Failed to get contact submissions:", error);
    return [];
  }
}

export async function updateContactSubmissionStatus(id: number, status: "pending" | "contacted" | "completed"): Promise<ContactSubmission | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update contact submission: database not available");
    return null;
  }

  try {
    await db.update(contactSubmissions).set({ status }).where(eq(contactSubmissions.id, id));
    const result = await db.select().from(contactSubmissions).where(eq(contactSubmissions.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to update contact submission:", error);
    throw error;
  }
}

// News Items
export async function createNewsItem(data: InsertNewsItem): Promise<NewsItem | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create news item: database not available");
    return null;
  }

  try {
    const result = await db.insert(newsItems).values(data);
    const id = result[0].insertId as number;
    const items = await db.select().from(newsItems).where(eq(newsItems.id, id)).limit(1);
    return items.length > 0 ? items[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create news item:", error);
    throw error;
  }
}

export async function getNewsItems(): Promise<NewsItem[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get news items: database not available");
    return [];
  }

  try {
    return await db.select().from(newsItems).orderBy(desc(newsItems.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get news items:", error);
    return [];
  }
}

export async function updateNewsItem(id: number, data: Partial<InsertNewsItem>): Promise<NewsItem | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update news item: database not available");
    return null;
  }

  try {
    await db.update(newsItems).set(data).where(eq(newsItems.id, id));
    const result = await db.select().from(newsItems).where(eq(newsItems.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to update news item:", error);
    throw error;
  }
}

export async function deleteNewsItem(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete news item: database not available");
    return false;
  }

  try {
    await db.delete(newsItems).where(eq(newsItems.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete news item:", error);
    throw error;
  }
}

// Blog Posts
export async function createBlogPost(data: InsertBlogPost): Promise<BlogPost | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create blog post: database not available");
    return null;
  }

  try {
    const result = await db.insert(blogPosts).values(data);
    const id = result[0].insertId as number;
    const posts = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    return posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create blog post:", error);
    throw error;
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get blog posts: database not available");
    return [];
  }

  try {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get blog posts:", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get blog post: database not available");
    return null;
  }

  try {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get blog post:", error);
    return null;
  }
}

export async function updateBlogPost(id: number, data: Partial<InsertBlogPost>): Promise<BlogPost | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update blog post: database not available");
    return null;
  }

  try {
    await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
    const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to update blog post:", error);
    throw error;
  }
}

export async function deleteBlogPost(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete blog post: database not available");
    return false;
  }

  try {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete blog post:", error);
    throw error;
  }
}

// TODO: add feature queries here as your schema grows.


// Client Reviews
export async function createClientReview(data: InsertClientReview): Promise<ClientReview | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create client review: database not available");
    return null;
  }

  try {
    const result = await db.insert(clientReviews).values(data);
    const id = result[0].insertId as number;
    const reviews = await db.select().from(clientReviews).where(eq(clientReviews.id, id)).limit(1);
    return reviews.length > 0 ? reviews[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create client review:", error);
    throw error;
  }
}

export async function getClientReviews(status?: string): Promise<ClientReview[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get client reviews: database not available");
    return [];
  }

  try {
    if (status) {
      return await db.select().from(clientReviews).where(eq(clientReviews.status, status as any)).orderBy(desc(clientReviews.createdAt));
    }
    return await db.select().from(clientReviews).orderBy(desc(clientReviews.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get client reviews:", error);
    return [];
  }
}

export async function updateClientReviewStatus(id: number, status: "pending" | "approved" | "rejected"): Promise<ClientReview | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update client review: database not available");
    return null;
  }

  try {
    await db.update(clientReviews).set({ status }).where(eq(clientReviews.id, id));
    const result = await db.select().from(clientReviews).where(eq(clientReviews.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to update client review:", error);
    throw error;
  }
}

export async function deleteClientReview(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete client review: database not available");
    return false;
  }

  try {
    await db.delete(clientReviews).where(eq(clientReviews.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete client review:", error);
    throw error;
  }
}

// Notifications
export async function createNotification(data: InsertNotification): Promise<Notification | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create notification: database not available");
    return null;
  }

  try {
    const result = await db.insert(notifications).values(data);
    const id = result[0].insertId as number;
    const notifs = await db.select().from(notifications).where(eq(notifications.id, id)).limit(1);
    return notifs.length > 0 ? notifs[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create notification:", error);
    throw error;
  }
}

export async function getNotifications(unreadOnly?: boolean): Promise<Notification[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get notifications: database not available");
    return [];
  }

  try {
    if (unreadOnly) {
      return await db.select().from(notifications).where(eq(notifications.isRead, 0)).orderBy(desc(notifications.createdAt));
    }
    return await db.select().from(notifications).orderBy(desc(notifications.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get notifications:", error);
    return [];
  }
}

export async function markNotificationAsRead(id: number): Promise<Notification | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update notification: database not available");
    return null;
  }

  try {
    await db.update(notifications).set({ isRead: 1 }).where(eq(notifications.id, id));
    const result = await db.select().from(notifications).where(eq(notifications.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to update notification:", error);
    throw error;
  }
}

export async function deleteNotification(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete notification: database not available");
    return false;
  }

  try {
    await db.delete(notifications).where(eq(notifications.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete notification:", error);
    throw error;
  }
}

// TODO: add feature queries here as your schema grows.

// Visitor Analytics
export async function trackVisitor(data: InsertVisitorAnalytics): Promise<VisitorAnalytics | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot track visitor: database not available");
    return null;
  }

  try {
    const result = await db.insert(visitorAnalytics).values(data);
    const id = result[0].insertId as number;
    const analytics = await db.select().from(visitorAnalytics).where(eq(visitorAnalytics.id, id)).limit(1);
    return analytics.length > 0 ? analytics[0] : null;
  } catch (error) {
    console.error("[Database] Failed to track visitor:", error);
    throw error;
  }
}

export async function getVisitorAnalytics(): Promise<VisitorAnalytics[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get visitor analytics: database not available");
    return [];
  }

  try {
    return await db.select().from(visitorAnalytics).orderBy(desc(visitorAnalytics.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get visitor analytics:", error);
    return [];
  }
}

export async function getPageAnalytics(page: string): Promise<VisitorAnalytics[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get page analytics: database not available");
    return [];
  }

  try {
    return await db.select().from(visitorAnalytics).where(eq(visitorAnalytics.page, page)).orderBy(desc(visitorAnalytics.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get page analytics:", error);
    return [];
  }
}

export async function getAnalyticsSummary(): Promise<{
  totalVisitors: number;
  totalPageViews: number;
  averageTimeSpent: number;
  averageScrollDepth: number;
  topPages: Array<{ page: string; views: number; avgTime: number }>;
}> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get analytics summary: database not available");
    return {
      totalVisitors: 0,
      totalPageViews: 0,
      averageTimeSpent: 0,
      averageScrollDepth: 0,
      topPages: [],
    };
  }

  try {
    const allAnalytics = await db.select().from(visitorAnalytics);
    
    const uniqueSessions = new Set(allAnalytics.map(a => a.sessionId)).size;
    const totalPageViews = allAnalytics.length;
    const avgTimeSpent = allAnalytics.length > 0 
      ? Math.round(allAnalytics.reduce((sum, a) => sum + a.timeSpent, 0) / allAnalytics.length)
      : 0;
    const avgScrollDepth = allAnalytics.length > 0
      ? Math.round(allAnalytics.reduce((sum, a) => sum + a.scrollDepth, 0) / allAnalytics.length)
      : 0;

    // Get top pages
    const pageMap = new Map<string, { views: number; totalTime: number }>();
    allAnalytics.forEach(a => {
      const existing = pageMap.get(a.page) || { views: 0, totalTime: 0 };
      pageMap.set(a.page, {
        views: existing.views + 1,
        totalTime: existing.totalTime + a.timeSpent,
      });
    });

    const topPages = Array.from(pageMap.entries())
      .map(([page, data]) => ({
        page,
        views: data.views,
        avgTime: Math.round(data.totalTime / data.views),
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    return {
      totalVisitors: uniqueSessions,
      totalPageViews,
      averageTimeSpent: avgTimeSpent,
      averageScrollDepth: avgScrollDepth,
      topPages,
    };
  } catch (error) {
    console.error("[Database] Failed to get analytics summary:", error);
    return {
      totalVisitors: 0,
      totalPageViews: 0,
      averageTimeSpent: 0,
      averageScrollDepth: 0,
      topPages: [],
    };
  }
}
