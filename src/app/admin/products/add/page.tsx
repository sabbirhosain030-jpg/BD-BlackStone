import React from 'react';
import { createProduct, getAdminCategories } from '../../actions';
import ProductForm from '../ProductForm';

export const dynamic = 'force-dynamic';

export default async function AddProductPage() {
    const categories = await getAdminCategories();

    return (
        <div className="add-product-page">
            <div className="admin-header">
                <h1 className="admin-title">Add New Product</h1>
            </div>

            <div className="stone-card" style={{ maxWidth: '800px' }}>
                <ProductForm
                    categories={categories}
                    action={createProduct}
                    submitText="Create Product"
                />
            </div>
        </div>
    );
}
