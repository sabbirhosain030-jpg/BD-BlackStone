'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export async function updateAdminCredentials(formData: FormData) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any)?.role !== 'ADMIN') {
            return {
                success: false,
                error: 'Unauthorized. Admin access required.'
            };
        }

        const currentEmail = session.user?.email;
        const newEmail = formData.get('newEmail') as string;
        const currentPassword = formData.get('currentPassword') as string;
        const newPassword = formData.get('newPassword') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        // Find the current admin user
        const admin = await prisma.user.findUnique({
            where: { email: currentEmail || '' }
        });

        if (!admin) {
            return { success: false, error: 'Admin user not found' };
        }

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, admin.password);
        if (!isValid) {
            return {
                success: false,
                error: 'Current password is incorrect'
            };
        }

        // Prepare update data
        const updateData: any = {};

        // Update email if provided and different
        if (newEmail && newEmail !== currentEmail) {
            // Check if new email already exists
            const emailExists = await prisma.user.findUnique({
                where: { email: newEmail }
            });

            if (emailExists) {
                return {
                    success: false,
                    error: 'Email address already in use'
                };
            }

            updateData.email = newEmail;
        }

        // Update password if provided
        if (newPassword) {
            if (newPassword.length < 8) {
                return {
                    success: false,
                    error: 'Password must be at least 8 characters long'
                };
            }

            if (newPassword !== confirmPassword) {
                return {
                    success: false,
                    error: 'New passwords do not match'
                };
            }

            // Hash the new password with bcrypt 12 rounds
            updateData.password = await bcrypt.hash(newPassword, 12);
        }

        // If no changes were requested
        if (Object.keys(updateData).length === 0) {
            return {
                success: false,
                error: 'No changes to update'
            };
        }

        // Update the admin credentials
        await prisma.user.update({
            where: { id: admin.id },
            data: updateData
        });

        revalidatePath('/admin/settings');

        return {
            success: true,
            message: 'Admin credentials updated successfully',
            emailChanged: !!updateData.email,
            passwordChanged: !!updateData.password
        };

    } catch (error) {
        console.error('Error updating admin credentials:', error);
        return {
            success: false,
            error: 'Failed to update credentials. Please try again.'
        };
    } finally {
        await prisma.$disconnect();
    }
}
