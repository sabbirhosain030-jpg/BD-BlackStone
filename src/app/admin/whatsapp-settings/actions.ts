'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Get WhatsApp settings (creates default if doesn't exist)
 */
export async function getWhatsAppSettings() {
    try {
        let settings = await prisma.whatsAppSettings.findFirst();

        // Create default settings if none exist
        if (!settings) {
            settings = await prisma.whatsAppSettings.create({
                data: {
                    businessPhone: '8801XXXXXXXXX',
                    isEnabled: true,
                    welcomeMessage: 'Hello! Thank you for shopping with BD BlackStone.'
                }
            });
        }

        return settings;
    } catch (error) {
        console.error('Failed to fetch WhatsApp settings:', error);
        return null;
    }
}

/**
 * Update WhatsApp settings
 */
export async function updateWhatsAppSettings(formData: FormData) {
    const businessPhone = formData.get('businessPhone') as string;
    const isEnabled = formData.get('isEnabled') === 'on';
    const welcomeMessage = formData.get('welcomeMessage') as string;

    if (!businessPhone || !welcomeMessage) {
        throw new Error('Business phone and welcome message are required');
    }

    try {
        // Get existing settings
        const existing = await prisma.whatsAppSettings.findFirst();

        if (existing) {
            // Update existing
            await prisma.whatsAppSettings.update({
                where: { id: existing.id },
                data: {
                    businessPhone,
                    isEnabled,
                    welcomeMessage
                }
            });
        } else {
            // Create new
            await prisma.whatsAppSettings.create({
                data: {
                    businessPhone,
                    isEnabled,
                    welcomeMessage
                }
            });
        }

        revalidatePath('/admin/whatsapp-settings');
        return { success: true };
    } catch (error) {
        console.error('Failed to update WhatsApp settings:', error);
        return { success: false, error: 'Failed to update settings' };
    }
}
