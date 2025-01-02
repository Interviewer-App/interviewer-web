import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { useAuth } from "@/context/AuthContext";
import CredentialsProvider from 'next-auth/providers/credentials'
import api from '../../../../lib/api/auth';


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

    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        
        // const provider = credentials.provider;
        const email = credentials.email;
        const password = credentials.password;

        try {
          const res = await api.post('/auth/login', { email, password });
          // const res = await login({email, password});
          console.log("res", res);
          const { token, user } = res.data;
          if (token) {
            console.log("Login successful");
            return {
              accessToken: token,
              role: user.role,
              email: user.email,
              id: user.userID,
            };

          } else {
            console.error("Login failed");
          }

        } catch (e) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile, user }) {

      // if (!account || !profile) {
      //   throw new Error("Missing account or profile data.");
      // }

      if (account.provider === "google") {
        try {
          const googleId = user.id;
          const provider = account.provider;
          const image = user.image;
          const { name, email } = user;
          console.log("googleId", googleId);
          console.log("Name:", name);
          console.log("Email:", email);
          console.log("Profile Picture:", image);
          console.log("Account provider:", provider);
          // const res = await login({ name, email, provider, googleId, image });

          // if (res) {
          //   const data = res.data;
          //   user.accessToken = data.token;
          //   user.id = data.id;
          //   user.image = data.avatar;
          //   user.country = data.country;
          // }
        } catch (error) {
          console.error(error);
        }
        return Promise.resolve(user);
      }
      return Promise.resolve(user);
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role; 
        token.id = user.id; 
        token.email = user.email; 
      }
      return token;
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.role = token.role;
      session.user.id = token.id;
      session.user.email = token.email;
      return session;
    },
    
  },
});

export { handler as GET, handler as POST };
