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
            } else {
               throw new Error("Incorrect email or password")
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