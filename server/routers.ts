import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { 
  createContactSubmission, 
  getContactSubmissions, 
  updateContactSubmissionStatus,
  createNewsItem,
  getNewsItems,
  updateNewsItem,
  deleteNewsItem,
  createBlogPost,
  getBlogPosts,
  getBlogPostBySlug,
  updateBlogPost,
  deleteBlogPost,
  createClientReview,
  getClientReviews,
  updateClientReviewStatus,
  deleteClientReview,
  createNotification,
  getNotifications,
  markNotificationAsRead,
  deleteNotification
} from "./db";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(2, "Name must be at least 2 characters"),
          email: z.string().email("Invalid email address"),
          phone: z.string().optional(),
          subject: z.string().min(5, "Subject must be at least 5 characters"),
          message: z.string().min(10, "Message must be at least 10 characters"),
        })
      )
      .mutation(async ({ input }) => {
        const submission = await createContactSubmission({
          name: input.name,
          email: input.email,
          phone: input.phone,
          subject: input.subject,
          message: input.message,
          status: "pending",
        });

        if (submission) {
          // Send notification to owner
          await notifyOwner({
            title: `New Contact Form Submission from ${input.name}`,
            content: `Email: ${input.email}\nPhone: ${input.phone || "Not provided"}\nSubject: ${input.subject}\n\nMessage:\n${input.message}`,
          });
        }

        return submission;
      }),
    getAll: publicProcedure.query(async () => {
      return await getContactSubmissions();
    }),
    updateStatus: publicProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["pending", "contacted", "completed"]),
        })
      )
      .mutation(async ({ input }) => {
        return await updateContactSubmissionStatus(input.id, input.status);
      }),
  }),

  news: router({
    create: publicProcedure
      .input(
        z.object({
          title: z.string().min(1, "Title is required"),
          link: z.string().url("Invalid URL"),
          emoji: z.string().optional().default("📰"),
          description: z.string().optional(),
          isExternal: z.number().optional().default(0),
        })
      )
      .mutation(async ({ input }) => {
        return await createNewsItem(input);
      }),
    getAll: publicProcedure.query(async () => {
      return await getNewsItems();
    }),
    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          link: z.string().url().optional(),
          emoji: z.string().optional(),
          description: z.string().optional(),
          isExternal: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await updateNewsItem(id, data);
      }),
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteNewsItem(input.id);
      }),
  }),

  blog: router({
    create: publicProcedure
      .input(
        z.object({
          slug: z.string().min(1, "Slug is required"),
          title: z.string().min(1, "Title is required"),
          content: z.string().min(10, "Content must be at least 10 characters"),
          category: z.string().optional(),
          author: z.string().optional(),
          excerpt: z.string().optional(),
          featuredImage: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await createBlogPost(input);
      }),
    getAll: publicProcedure.query(async () => {
      return await getBlogPosts();
    }),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await getBlogPostBySlug(input.slug);
      }),
    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          slug: z.string().optional(),
          title: z.string().optional(),
          content: z.string().optional(),
          category: z.string().optional(),
          author: z.string().optional(),
          excerpt: z.string().optional(),
          featuredImage: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await updateBlogPost(id, data);
      }),
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteBlogPost(input.id);
      }),
  }),

  reviews: router({
    create: publicProcedure
      .input(
        z.object({
          clientName: z.string().min(2, "Name is required"),
          clientEmail: z.string().email("Invalid email"),
          rating: z.number().min(1).max(5),
          review: z.string().min(10, "Review must be at least 10 characters"),
          company: z.string().optional(),
          image: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const review = await createClientReview({
          ...input,
          status: "pending",
        });
        
        if (review) {
          await createNotification({
            title: `New Review from ${input.clientName}`,
            message: `A new client review has been submitted and is pending approval.`,
            type: "review",
            relatedId: review.id,
          });
          
          await notifyOwner({
            title: `New Client Review Pending Approval`,
            content: `${input.clientName} submitted a ${input.rating}-star review. Please approve or reject it in the admin panel.`,
          });
        }
        
        return review;
      }),
    getApproved: publicProcedure.query(async () => {
      return await getClientReviews("approved");
    }),
    getAll: publicProcedure.query(async () => {
      return await getClientReviews();
    }),
    updateStatus: publicProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["pending", "approved", "rejected"]),
        })
      )
      .mutation(async ({ input }) => {
        return await updateClientReviewStatus(input.id, input.status);
      }),
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteClientReview(input.id);
      }),
  }),

  notifications: router({
    getAll: publicProcedure.query(async () => {
      return await getNotifications();
    }),
    getUnread: publicProcedure.query(async () => {
      return await getNotifications(true);
    }),
    markAsRead: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await markNotificationAsRead(input.id);
      }),
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteNotification(input.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
