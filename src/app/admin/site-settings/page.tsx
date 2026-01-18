import React from 'react';
import { getSiteSettings } from '../actions';
import SiteSettingsForm from './SiteSettingsForm';

export const revalidate = 0;

export default async function SiteSettingsPage() {
    const settings = await getSiteSettings();

    return <SiteSettingsForm settings={settings} />;
}
