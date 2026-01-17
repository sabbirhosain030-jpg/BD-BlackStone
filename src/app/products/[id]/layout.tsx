import { Metadata } from 'next';
import { getProductById } from '../../actions';

export async function generateMetadata({ params }: {
    params: Promise<{ id: string }>
}): Promise<Metadata> {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        return {
            title: 'Product Not Found - BD BlackStone'
        };
    }

    // Parse images
    let images: string[] = [];
    try {
        const parsed = JSON.parse(product.images);
        if (Array.isArray(parsed)) images = parsed;
    } catch (e) {
        images = ['/placeholder.png'];
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    return {
        title: `${product.name} - BD BlackStone`,
        description: product.description,
        openGraph: {
            title: product.name,
            description: product.description,
            images: images.length > 0 ? [
                {
                    url: images[0],
                    width: 800,
                    height: 1000,
                    alt: product.name
                }
            ] : [],
            url: `${siteUrl}/products/${id}`,
            type: 'website',
            siteName: 'BD BlackStone'
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: product.description,
            images: images.length > 0 ? [images[0]] : []
        }
    };
}

export default function ProductLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
