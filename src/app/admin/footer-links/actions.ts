'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Get all footer links
export async function getFooterLinks() {
    try {
        const links = await prisma.footerLink.findMany({
            orderBy: { order: 'asc' },
        });
        return { success: true, links };
    } catch (error) {
        console.error('Error fetching footer links:', error);
        return { success: false, error: 'Failed to fetch footer links' };
    }
}

// Create a new footer link
export async function createFooterLink(data: { label: string; url: string; section?: string; order?: number }) {
    try {
        const link = await prisma.footerLink.create({
            data: {
                label: data.label,
                url: data.url,
                section: data.section || 'Quick Links',
                order: data.order || 0,
                isActive: true
            },
        });
        revalidatePath('/admin/footer-links');
        revalidatePath('/'); // Revalidate home/footer
        return { success: true, link };
    } catch (error) {
        console.error('Error creating footer link:', error);
        return { success: false, error: 'Failed to create footer link' };
    }
}

// Update a footer link
export async function updateFooterLink(id: string, data: { label?: string; url?: string; section?: string; order?: number; isActive?: boolean }) {
    try {
        const link = await prisma.footerLink.update({
            where: { id },
            data,
        });
        revalidatePath('/admin/footer-links');
        revalidatePath('/');
        return { success: true, link };
    } catch (error) {
        console.error('Error updating footer link:', error);
        return { success: false, error: 'Failed to update footer link' };
    }
}

// Delete a footer link
export async function deleteFooterLink(id: string) {
    try {
        await prisma.footerLink.delete({
            where: { id },
        });
        revalidatePath('/admin/footer-links');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error deleting footer link:', error);
        return { success: false, error: 'Failed to delete footer link' };
    }
}
