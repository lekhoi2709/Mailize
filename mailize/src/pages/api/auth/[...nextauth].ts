import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
   providers: [
      CredentialsProvider({
         name: "Credentials",
         credentials: {
            email: {},
            password: {}
         },
         async authorize(credentials, req) {
            const res = await fetch("http://localhost:8080/api/auth/login", {
               method: "POST",
               headers: {
                  "Content-Type": "application/json"
               },
               body: JSON.stringify({
                  email: credentials?.email,
                  password: credentials?.password,
               })
            })
            const user = await res.json()

            if (user.code == 0) {
               return user
            } else if (user.code == 3) {
               if (user.msg == "Username not found") {
                  throw new Error("Username not found")
               } else {
                  throw new Error("Incorrect password")
               }
            } else {
               throw new Error("Error")
            }
         }
      })
   ],

   pages: {
      signIn: '/auth/login',
   },

   callbacks: {
      async jwt({ token, user }) {
         return { ...token, ...user }
      },

      async session({ session, token, user }) {
         session.user = token as any
         return session
      }
   }
})