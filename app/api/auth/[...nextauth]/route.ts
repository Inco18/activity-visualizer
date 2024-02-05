import NextAuth from "next-auth";
import StravaProvider from "next-auth/providers/strava";

const handler = NextAuth({
  providers: [
    StravaProvider({
      clientId: process.env.STRAVA_CLIENT_ID!,
      clientSecret: process.env.STRAVA_CLIENT_SECRET!,
      authorization: { params: { scope: "read_all" } },
    }),
  ],
});

export { handler as GET, handler as POST };
