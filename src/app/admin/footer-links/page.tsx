'use client';

import { useState, useEffect } from 'react';
import { getFooterLinks, createFooterLink, deleteFooterLink, updateFooterLink } from './actions';
import { toast } from 'react-hot-toast';

interface FooterLink {
    id: string;
    label: string;
    url: string;
    section: string;
    order: number;
    isActive: boolean;
}

export default function FooterLinksPage() {
    const [links, setLinks] = useState<FooterLink[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newLink, setNewLink] = useState({ label: '', url: '', section: 'Quick Links', order: 0 });

    useEffect(() => {
        loadLinks();
    }, []);

    const loadLinks = async () => {
        const res = await getFooterLinks();
        if (res.success && res.links) {
            setLinks(res.links as unknown as FooterLink[]);
        }
        setIsLoading(false);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await createFooterLink(newLink);
        if (res.success) {
            toast.success('Link created');
            setNewLink({ label: '', url: '', section: 'Quick Links', order: 0 });
            loadLinks();
        } else {
            toast.error('Failed to create link');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        const res = await deleteFooterLink(id);
        if (res.success) {
            toast.success('Link deleted');
            loadLinks();
        } else {
            toast.error('Failed to delete link');
        }
    };

    const handleToggleActive = async (link: FooterLink) => {
        const res = await updateFooterLink(link.id, { isActive: !link.isActive });
        if (res.success) {
            toast.success('Status updated');
            loadLinks();
        }
    };

    if (isLoading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-white">Manage Footer Links</h1>

            {/* Create Form */}
            <div className="bg-zinc-900 p-6 rounded-xl mb-8 border border-zinc-800">
                <h2 className="text-xl font-semibold mb-4 text-white">Add New Link</h2>
                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <input
                        type="text"
                        placeholder="Label (e.g., About Us)"
                        value={newLink.label}
                        onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                        className="bg-zinc-800 text-white p-2 rounded border border-zinc-700"
                        required
                    />
                    <input
                        type="text"
                        placeholder="URL (e.g., /about)"
                        value={newLink.url}
                        onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                        className="bg-zinc-800 text-white p-2 rounded border border-zinc-700"
                        required
                    />
                    <select
                        value={newLink.section}
                        onChange={(e) => setNewLink({ ...newLink, section: e.target.value })}
                        className="bg-zinc-800 text-white p-2 rounded border border-zinc-700"
                    >
                        <option value="Quick Links">Quick Links</option>
                        <option value="Customer Service">Customer Service</option>
                        <option value="Company">Company</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Order"
                        value={newLink.order}
                        onChange={(e) => setNewLink({ ...newLink, order: parseInt(e.target.value) })}
                        className="bg-zinc-800 text-white p-2 rounded border border-zinc-700"
                    />
                    <button type="submit" className="bg-white text-black font-bold py-2 px-4 rounded hover:bg-gray-200">
                        Add Link
                    </button>
                </form>
            </div>

            {/* Links List */}
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                <table className="w-full text-left text-zinc-400">
                    <thead className="bg-zinc-950 text-zinc-200 uppercase text-sm">
                        <tr>
                            <th className="p-4">Label</th>
                            <th className="p-4">URL</th>
                            <th className="p-4">Section</th>
                            <th className="p-4">Order</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {links.map((link) => (
                            <tr key={link.id} className="hover:bg-zinc-800/50">
                                <td className="p-4 font-medium text-white">{link.label}</td>
                                <td className="p-4 font-mono text-sm text-zinc-500">{link.url}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 bg-zinc-800 rounded text-xs">{link.section}</span>
                                </td>
                                <td className="p-4">{link.order}</td>
                                <td className="p-4">
                                    <button
                                        onClick={() => handleToggleActive(link)}
                                        className={`px-2 py-1 rounded text-xs font-bold ${link.isActive ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                                            }`}
                                    >
                                        {link.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => handleDelete(link.id)}
                                        className="text-red-400 hover:text-red-300 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {links.length === 0 && (
                    <div className="p-8 text-center text-zinc-500">No links found. Add one above!</div>
                )}
            </div>
        </div>
    );
}
