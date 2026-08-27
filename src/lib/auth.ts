import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user && user.email) {
        try {
          const { syncUserProfile } = await import("./supabase");
          await syncUserProfile({
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          });
        } catch (e) {
          console.warn("[Auth] Failed to sync user profile with Supabase:", e);
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.name = token.name || session.user.name;
        session.user.email = token.email || session.user.email;
        session.user.image = (token.picture as string) || session.user.image;
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "marketshield_super_secure_secret_key_2025_prod_jwt",
  debug: process.env.NODE_ENV === "development",
};
