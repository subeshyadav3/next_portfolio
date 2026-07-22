/**
 * Edge-safe NextAuth config.
 *
 * Used ONLY by `middleware.ts` — middleware runs in Vercel's Edge Runtime,
 * which does NOT support Node.js APIs (`crypto`, `setImmediate`) and cannot
 * bundle the Prisma engine or `bcryptjs`. Importing the full auth config
 * (with `PrismaAdapter` + `bcryptjs`) from middleware balloons the edge
 * bundle to ~1.02 MB and exceeds Vercel's 1 MB free-tier middleware limit.
 *
 * The actual login API (`/api/auth/[...nextauth]`) keeps using the full
 * config in `lib/auth/config.ts` — middleware only needs to *verify* the
 * JWT, not mint new sessions. Both configs must share the same `AUTH_SECRET`
 * and the same JWT/session callbacks so the token shape matches.
 *
 * IMPORTANT: keep `callbacks.jwt` and `callbacks.session` here in sync with
 * the ones in `config.ts`. If they diverge, tokens minted at sign-in won't
 * match what middleware reads on later requests.
 */
import NextAuth, { type NextAuthConfig } from "next-auth";

export const edgeAuthConfig: NextAuthConfig = {
  // JWT-only — no DB lookup in middleware. The session strategy MUST match
  // `lib/auth/config.ts` exactly or middleware will refuse tokens issued
  // by the full config.
  session: { strategy: "jwt" },
  // Required for production behind Vercel / reverse-proxy.
  trustHost: true,
  // No providers here — middleware doesn't run credential checks. The
  // providers array must still be present (NextAuth requires it).
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};

export const { auth } = NextAuth(edgeAuthConfig);
