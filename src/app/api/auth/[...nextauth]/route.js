import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ account, profile, user }) {

      if (!account || !profile) {
        throw new Error("Missing account or profile data.");
      }

      if (account.provider === "google") {
        try {
          const googleId = profile.sub;
          const provider = account.provider;
          const image = profile.picture;
          const { name, email} = profile;

          console.log("googleId", googleId);
          console.log("Name:", name);
          console.log("Email:", email);
          console.log("Profile Picture:", image);
          console.log("Account provider:", provider);
        } catch (error) {
          console.error("Error in Google sign-in callback:", error);
        }
      }
      return true;
    },
    
  },
});

export { handler as GET, handler as POST };
