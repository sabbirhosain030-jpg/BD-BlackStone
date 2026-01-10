import React from 'react';
import { updateProduct, getProduct, getAdminCategories } from '../../actions';
import ProductForm from '../ProductForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);
    const categories = await getAdminCategories();

    if (!product) {
        notFound();
    }

    // Bind the id to the updateProduct function
    const updateProductWithId = updateProduct.bind(null, id);

    return (
        <div className="edit-product-page">
            <div className="admin-header">
                <h1 className="admin-title">Edit Product</h1>
            </div>

            <div className="stone-card" style={{ maxWidth: '800px' }}>
                <ProductForm
                    categories={categories}
                    initialData={product}
                    action={updateProductWithId}
                    submitText="Update Product"
                />
            </div>
        </div>
    );
}
