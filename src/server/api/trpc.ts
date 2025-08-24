/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

import { initTRPC } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";
import { prisma } from "@/server/db";

type CreateContextOptions = {
  userId?: number;
};

const createInnerTRPCContext = async (opts: CreateContextOptions) => {
  let session = null;
  
  if (opts.userId) {
    // Fetch user data from database
    const user = await prisma.users.findUnique({
      where: { id: opts.userId }
    });
    
    if (user) {
      session = {
        user: {
          userId: user.id,
          role: user.role,
          school: user.school,
          view: user.view,
          email: user.email,
          name: `${user.first_name} ${user.last_name}`,
          phone: user.phone, // Add this line
          first_name: user.first_name, // Add this if needed
          last_name: user.last_name // Add this if needed
        }
      };
    }
  }
  
  return {
    prisma,
    session
  };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  // Get userId from headers or query params
  const userId = opts.req.headers['x-demo-user-id'] || opts.req.query.userId;
  let parsedUserId = userId ? parseInt(userId as string) : undefined;
  
  // TEMPORARY: Hardcode user ID for testing
  if (!parsedUserId) {
    parsedUserId = 1; // Change this to a valid user ID from your database
  }
  
  console.log('tRPC Context - using userId:', parsedUserId);
  
  return await createInnerTRPCContext({ userId: parsedUserId });
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = publicProcedure;
