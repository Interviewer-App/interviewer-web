// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import GitHubProvider from "next-auth/providers/github";
// import { useAuth } from "@/context/AuthContext";
// import CredentialsProvider from 'next-auth/providers/credentials'
// import { api } from "@/lib/api/api";
// import { checkUserAvailability, signUp, providerRegistration, Login } from '@/lib/api/authentication';

// export const authOptions = {
//   pages: {
//     signIn: "/login",
//     newUser: "/register",
//     error: "/error"
//   },
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),

//     GitHubProvider({
//       clientId: process.env.GITHUB_CLIENT_ID,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET,
//     }),

//     CredentialsProvider({
//       name: "credentials",
//       credentials: {},
//       async authorize(credentials, req) {

//         // const provider = credentials.provider;
//         const email = credentials.email;
//         const password = credentials.password;
//         const loginData = { email, password };
//         try {
//           // const res = await Login(loginData);
//           const res = await api.post(`/auth/login`, loginData);
//           // const res = await login({email, password});
//           // const { token, user } = res.data;

//           if (res.data.token) {
//             let companyID ;
//             let candidateID;
//             if (res.data.user.role === 'COMPANY') {
//               companyID = res.data.user.companyID
//             } else {
//               candidateID = res.data.user.candidateID
//             }
//             console.log("Login successful");
//             return {
//               accessToken: res.data.token,
//               role: res.data.user.role,
//               email: res.data.user.email,
//               id: res.data.user.userID,
//               companyID: companyID,
//               candidateID: candidateID
//             };

//           }

//         } catch (e) {
//           console.log("Invalid email or password");
//         }
//       },
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET,
//   callbacks: {
//     async signIn({ account, profile, user }) {

//       // if (!account || !profile) {
//       //   throw new Error("Missing account or profile data.");
//       // }

//       if (account.provider === "google" || account.provider === "github") {
//         try {
//           const providerid = user.id;
//           const provider = account.provider;
//           const image = user.image;
//           const { name, email } = user;

//           const firstname = name.split(" ")[0];
//           const lastname = name.split(" ")[1];

//           const userData = {
//             firstname,
//             lastname,
//             email,
//             provider,
//             providerAccountId: providerid,
//             role: "CANDIDATE",
//           };


//           const newUser = await providerRegistration(userData);
//           let companyID ;
//             let candidateID;
//             if (newUser.user.role === 'COMPANY') {
//               companyID = newUser.user.company.companyID
//             } else {
//               candidateID = newUser.user.candidate.candidateID
//             }

//           if (newUser.token) {
//             user.accessToken = newUser.token;
//             user.role = newUser.user.role
//             user.email = newUser.user.email
//             user.id = newUser.user.userID,
//             user.companyID = companyID,
//             user.candidateID = candidateID
//           }


//           // const res = await login({ name, email, provider, googleId, image });

//           // if (res) {
//           //   const data = res.data;
//           //   user.accessToken = data.token;
//           //   user.id = data.id;
//           //   user.image = data.avatar;
//           //   user.country = data.country;
//           // }
//         } catch (error) {
//           console.log(error);
//         }
//         return Promise.resolve(user);
//       }
//       return Promise.resolve(user);
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         token.accessToken = user.accessToken;
//         token.role = user.role;
//         token.id = user.id;
//         token.email = user.email;
//         token.companyID = user.companyID,
//         token.candidateID = user.candidateID
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.user.accessToken = token.accessToken;
//       session.user.role = token.role;
//       session.user.id = token.id;
//       session.user.email = token.email;
//       session.user.companyID = token.companyID,
//       session.user.candidateID = token.candidateID
//       return session;
//     },

//   },
// };
