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
  deleteNotification,
  trackVisitor,
  getVisitorAnalytics,
  getPageAnalytics,
  getAnalyticsSummary,
  createBlogComment,
  getBlogCommentsByPostId,
  getApprovedBlogCommentsByPostId,
  updateBlogCommentStatus,
  deleteBlogComment,
  createNewsletterSubscriber,
  getNewsletterSubscribers,
  updateNewsletterSubscriberStatus,
  deleteNewsletterSubscriber,
  createProduct,
  getProducts,
  getActiveProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  createPromotion,
  getPromotions,
  getActivePromotions,
  updatePromotion,
  deletePromotion
} from "./db";
import { notifyOwner, sendContactFormEmail } from "./_core/notification";

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
          // Send notification to owner via Manus notification service
          await notifyOwner({
            title: `New Contact Form Submission from ${input.name}`,
            content: `Email: ${input.email}\nPhone: ${input.phone || "Not provided"}\nSubject: ${input.subject}\n\nMessage:\n${input.message}`,
          });
          
          // Also send email notification to admin
          await sendContactFormEmail(input);
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
          isPublished: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await createBlogPost(input);
      }),
    getAll: publicProcedure.query(async () => {
      const allBlogs = await getBlogPosts();
      return allBlogs.filter(blog => blog.isPublished === 1);
    }),
    getAllAdmin: publicProcedure.query(async () => {
      return await getBlogPosts();
    }),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const blog = await getBlogPostBySlug(input.slug);
        if (blog && blog.isPublished === 1) {
          return blog;
        }
        return null;
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
          isPublished: z.number().optional(),
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
    togglePublish: publicProcedure
      .input(
        z.object({
          id: z.number(),
          isPublished: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        return await updateBlogPost(input.id, {
          isPublished: input.isPublished,
        });
      }),
    deleteAdmin: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteBlogPost(input.id);
      }),
    createComment: publicProcedure
      .input(
        z.object({
          blogPostId: z.number(),
          authorName: z.string().min(1),
          authorEmail: z.string().email(),
          content: z.string().min(5),
        })
      )
      .mutation(async ({ input }) => {
        return await createBlogComment(input);
      }),
    getCommentsByPost: publicProcedure
      .input(z.object({ blogPostId: z.number() }))
      .query(async ({ input }) => {
        return await getApprovedBlogCommentsByPostId(input.blogPostId);
      }),
    getAllComments: publicProcedure.query(async () => {
      const comments = await getBlogCommentsByPostId(0);
      return comments || [];
    }),
    approveComment: publicProcedure
      .input(z.object({ commentId: z.number() }))
      .mutation(async ({ input }) => {
        return await updateBlogCommentStatus(input.commentId, "approved");
      }),
    rejectComment: publicProcedure
      .input(z.object({ commentId: z.number() }))
      .mutation(async ({ input }) => {
        return await updateBlogCommentStatus(input.commentId, "rejected");
      }),
    deleteComment: publicProcedure
      .input(z.object({ commentId: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteBlogComment(input.commentId);
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
    getPending: publicProcedure.query(async () => {
      return await getClientReviews("pending");
    }),
    getAll: publicProcedure.query(async () => {
      return await getClientReviews();
    }),
    approve: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await updateClientReviewStatus(input.id, "approved");
      }),
    reject: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await updateClientReviewStatus(input.id, "rejected");
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

  comments: router({
    create: publicProcedure
      .input(
        z.object({
          blogPostId: z.number(),
          authorName: z.string().min(2, "Name must be at least 2 characters"),
          authorEmail: z.string().email("Invalid email address"),
          content: z.string().min(5, "Comment must be at least 5 characters"),
        })
      )
      .mutation(async ({ input }) => {
        const comment = await createBlogComment({
          blogPostId: input.blogPostId,
          authorName: input.authorName,
          authorEmail: input.authorEmail,
          content: input.content,
          status: "pending",
        });

        if (comment) {
          await createNotification({
            title: `New Comment on Blog Post`,
            message: `${input.authorName} left a comment. Please approve or reject it in the admin panel.`,
            type: "system",
            relatedId: comment.id,
          });
          
          await notifyOwner({
            title: `New Blog Comment Pending Approval`,
            content: `${input.authorName} commented: "${input.content.substring(0, 100)}..."`,
          });
        }

        return comment;
      }),
    getApproved: publicProcedure
      .input(z.object({ blogPostId: z.number() }))
      .query(async ({ input }) => {
        return await getApprovedBlogCommentsByPostId(input.blogPostId);
      }),
    getAll: publicProcedure
      .input(z.object({ blogPostId: z.number() }))
      .query(async ({ input }) => {
        return await getBlogCommentsByPostId(input.blogPostId);
      }),
    approve: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await updateBlogCommentStatus(input.id, "approved");
      }),
    reject: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await updateBlogCommentStatus(input.id, "rejected");
      }),
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteBlogComment(input.id);
      }),
  }),

  newsletter: router({
    subscribe: publicProcedure
      .input(
        z.object({
          email: z.string().email("Invalid email address"),
          name: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const subscriber = await createNewsletterSubscriber({
            email: input.email,
            name: input.name,
            status: "subscribed",
          });

          if (subscriber) {
            await notifyOwner({
              title: `New Newsletter Subscriber`,
              content: `${input.name || input.email} has subscribed to the newsletter.`,
            });
          }

          return subscriber;
        } catch (error: any) {
          if (error.message && error.message.includes("Duplicate entry")) {
            throw new Error("This email is already subscribed to our newsletter.");
          }
          throw error;
        }
      }),
    getAll: publicProcedure.query(async () => {
      return await getNewsletterSubscribers();
    }),
    unsubscribe: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await updateNewsletterSubscriberStatus(input.id, "unsubscribed");
      }),
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteNewsletterSubscriber(input.id);
      }),
  }),

  analytics: router({
    track: publicProcedure
      .input(
        z.object({
          sessionId: z.string(),
          page: z.string(),
          timeSpent: z.number(),
          scrollDepth: z.number().optional().default(0),
          referrer: z.string().optional(),
          userAgent: z.string().optional(),
          ipAddress: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await trackVisitor(input);
      }),
    getAll: publicProcedure.query(async () => {
      return await getVisitorAnalytics();
    }),
    getByPage: publicProcedure
      .input(z.object({ page: z.string() }))
      .query(async ({ input }) => {
        return await getPageAnalytics(input.page);
      }),
    getSummary: publicProcedure.query(async () => {
      return await getAnalyticsSummary();
    }),
  }),

  products: router({
    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "Product name is required"),
          description: z.string().optional(),
          category: z.string().optional(),
          price: z.string().optional(),
          discountPrice: z.string().optional(),
          image: z.string().optional(),
          isActive: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await createProduct(input as any);
      }),
    getAll: publicProcedure.query(async () => {
      return await getProducts();
    }),
    getActive: publicProcedure.query(async () => {
      return await getActiveProducts();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getProductById(input.id);
      }),
    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          description: z.string().optional(),
          category: z.string().optional(),
          price: z.string().optional(),
          discountPrice: z.string().optional(),
          image: z.string().optional(),
          isActive: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await updateProduct(id, data as any);
      }),
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteProduct(input.id);
      }),
  }),

  orders: router({
    create: publicProcedure
      .input(
        z.object({
          productId: z.number(),
          customerName: z.string().min(1, "Customer name is required"),
          customerEmail: z.string().email(),
          customerPhone: z.string().optional(),
          quantity: z.number().optional(),
          totalPrice: z.string(),
          status: z.string().optional(),
          paymentMethod: z.string().optional(),
          notes: z.string().optional(),
          transactionId: z.string().optional(),
          paymentProofUrl: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await createOrder(input as any);
      }),
    getAll: publicProcedure.query(async () => {
      return await getOrders();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getOrderById(input.id);
      }),
    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.string().optional(),
          paymentMethod: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await updateOrder(id, data as any);
      }),
  }),

  promotions: router({
    create: publicProcedure
      .input(
        z.object({
          productId: z.number().optional(),
          title: z.string().min(1, "Promo title is required"),
          description: z.string().optional(),
          discountPercent: z.number().optional(),
          discountAmount: z.string().optional(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
          isActive: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await createPromotion(input as any);
      }),
    getAll: publicProcedure.query(async () => {
      return await getPromotions();
    }),
    getActive: publicProcedure.query(async () => {
      return await getActivePromotions();
    }),
    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          description: z.string().optional(),
          discountPercent: z.number().optional(),
          discountAmount: z.string().optional(),
          isActive: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await updatePromotion(id, data as any);
      }),
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deletePromotion(input.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
