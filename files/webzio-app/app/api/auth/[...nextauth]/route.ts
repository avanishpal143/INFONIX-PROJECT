import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import dbConnect from '@/lib/db'
import User from '@/models/User'

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === 'google') {
                try {
                    await dbConnect()

                    // Check if user already exists
                    let existingUser = await User.findOne({ email: user.email })

                    if (!existingUser) {
                        // Create new user with Google OAuth
                        existingUser = await User.create({
                            name: user.name,
                            email: user.email,
                            password: '', // No password for OAuth users
                            isVerified: true, // Google users are auto-verified
                            oauthProvider: 'google',
                            oauthId: account.providerAccountId,
                        })
                    } else if (!existingUser.oauthProvider) {
                        // Link Google account to existing email/password user
                        existingUser.oauthProvider = 'google'
                        existingUser.oauthId = account.providerAccountId
                        existingUser.isVerified = true
                        await existingUser.save()
                    }

                    return true
                } catch (error) {
                    console.error('Error in Google sign in:', error)
                    return false
                }
            }
            return true
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id
                token.email = user.email
                token.name = user.name
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.email = token.email as string
                session.user.name = token.name as string
            }
            return session
        },
        async redirect({ url, baseUrl }) {
            // Redirect to auth-callback to sync session with Zustand store
            if (url.startsWith(baseUrl)) return `${baseUrl}/auth-callback`
            if (url.startsWith('/')) return `${baseUrl}${url}`
            return baseUrl + '/auth-callback'
        }
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
