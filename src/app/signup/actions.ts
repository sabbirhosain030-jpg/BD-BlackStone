'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function registerUser(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password) {
        return { success: false, error: 'Missing fields' };
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { success: false, error: 'User already exists with this email' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'CUSTOMER', // Explicitly set as Customer
            },
        });

        return { success: true };
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, error: 'Something went wrong during registration' };
    }
}
