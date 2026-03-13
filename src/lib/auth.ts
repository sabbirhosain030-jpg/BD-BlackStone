import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

if (!process.env.NEXTAUTH_SECRET) {
    console.error('❌ NEXTAUTH_SECRET is missing! Login will fail.');
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log('🔑 [Auth] Authorize attempt for:', credentials?.email);
                
                // TEMP DEBUG: Hardcoded admin check
                if (credentials?.email === 'admin@blackstone.com' && credentials?.password === 'Admin123!') {
                    console.log('✅ [Auth] DEBUG: Hardcoded login success');
                    return {
                        id: 'debug-admin-id',
                        name: 'Debug Admin',
                        email: 'admin@blackstone.com',
                        role: 'ADMIN',
                    };
                }

                if (credentials?.email === '01712345678' && credentials?.password === 'Admin123!') {
                    console.log('✅ [Auth] DEBUG: Hardcoded phone login success');
                    return {
                        id: 'debug-admin-id',
                        name: 'Debug Admin',
                        email: 'admin@blackstone.com',
                        role: 'ADMIN',
                    };
                }

                try {
                    const user = await prisma.user.findFirst({
                        where: {
                            OR: [
                                { email: credentials?.email || '' },
                                { phone: credentials?.email || '' }
                            ]
                        }
                    });

                    console.log('👤 [Auth] User found:', user ? user.email : 'None');

                    if (!user || !user.password) {
                        console.log('⚠️ [Auth] User not found or no password');
                        return null; // Return null instead of throwing to be safer
                    }

                    const isCorrectPassword = await bcrypt.compare(
                        credentials!.password,
                        user.password
                    );

                    console.log('🔐 [Auth] Password correct:', isCorrectPassword);

                    if (!isCorrectPassword) {
                        return null;
                    }

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    };
                } catch (error) {
                    console.error('🔥 [Auth] Exception in authorize:', error);
                    return null;
                }
            }
        })
    ],
    pages: {
        signIn: '/login', // Regular users login page
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            try {
                if (session.user) {
                    (session.user as any).id = token.id;
                    (session.user as any).role = token.role;
                }
            } catch (error) {
                console.error('🔥 [Auth] Session callback error:', error);
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            // If user is admin and just logged in, redirect to admin panel
            const urlObj = new URL(url, baseUrl);
            if (urlObj.searchParams.get('callbackUrl')?.startsWith('/admin')) {
                return urlObj.searchParams.get('callbackUrl') || '/admin';
            }
            // Otherwise use default behavior
            return url.startsWith(baseUrl) ? url : baseUrl;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days - keeps admin logged in
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development', // Enable debug logs in dev
};
