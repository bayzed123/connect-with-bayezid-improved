import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createContactSubmission, getContactSubmissions, updateContactSubmissionStatus } from "./db";
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
});

export type AppRouter = typeof appRouter;
