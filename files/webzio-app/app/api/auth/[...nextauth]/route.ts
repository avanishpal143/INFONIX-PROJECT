import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import dbConnect from '../../../../lib/db'
import User from '../../../../models/User'
import { generateToken } from '../../../../lib/auth'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          await dbConnect()
          const existingUser = await User.findOne({ email: user.email })

          if (existingUser) {
            // User exists — update oauth info and mark verified
            existingUser.oauthProvider = 'google'
            existingUser.oauthId = account.providerAccountId
            existingUser.isVerified = true
            existingUser.avatar = user.image || existingUser.avatar
            await existingUser.save()
          } else {
            // New user via Google — create and auto-verify
            await User.create({
              name: user.name,
              email: user.email,
              password: null,
              avatar: user.image || '',
              isVerified: true,
              isActive: true,
              oauthProvider: 'google',
              oauthId: account.providerAccountId,
            })
          }
          return true
        } catch (err) {
          console.error('Google signIn error:', err)
          return false
        }
      }
      return true
    },

    async jwt({ token, user, account }) {
      if (account?.provider === 'google' && user?.email) {
        try {
          await dbConnect()
          const dbUser = await User.findOne({ email: user.email })
          if (dbUser) {
            token.id = dbUser._id.toString()
            token.role = dbUser.role
            token.customToken = generateToken({ id: dbUser._id, email: dbUser.email })
          }
        } catch {}
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
        ;(session.user as any).role = token.role
        ;(session.user as any).customToken = token.customToken
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }
