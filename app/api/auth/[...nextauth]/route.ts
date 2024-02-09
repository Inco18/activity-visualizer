import NextAuth from "next-auth";
import StravaProvider from "next-auth/providers/strava";

export const authOptions = {
  providers: [
    StravaProvider({
      clientId: process.env.STRAVA_CLIENT_ID!,
      clientSecret: process.env.STRAVA_CLIENT_SECRET!,
      authorization: { params: { scope: "read_all" } },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
