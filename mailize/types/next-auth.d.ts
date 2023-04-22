import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
   interface Session {
      user: {
         accessToken: string,
         code: number,
         email: string,
         exp: number,
         firstName: string,
         iat: number,
         jti: string,
         lastName: string,
         phone: string,
         role: string
      } & DefaultSession["user"]
   }
}