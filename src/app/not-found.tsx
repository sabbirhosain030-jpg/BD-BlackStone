import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4">
            <div className="text-center">
                <h2 className="text-4xl font-bold text-[#d4af37] mb-4">404</h2>
                <p className="text-xl text-stone-300 mb-8">Page Not Found</p>
                <p className="text-stone-400 mb-8 max-w-md mx-auto">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <Link href="/">
                    <Button variant="primary">Return Home</Button>
                </Link>
            </div>
        </div>
    );
}
