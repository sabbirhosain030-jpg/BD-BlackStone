'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import './CategoryPills.css';

type SubCategory = {
    id: string;
    name: string;
    slug: string;
};

type Category = {
    id: string;
    name: string;
    slug: string;
    subCategories?: SubCategory[];
};

interface CategoryPillsProps {
    categories: Category[];
    currentCategory: string | undefined;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
    categories,
    currentCategory
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSubCategory = searchParams.get('subCategory');

    // If no category selected, or category not found, or category has no subcategories, don't show specific pills
    // However, if no category selected, we might want to show main categories? 
    // The user request was specific about "Man, boy..." having sub list.
    // Let's assume this bar appears when a main category is selected.

    const activeCategory = categories.find(c => c.slug === currentCategory);

    if (!activeCategory || !activeCategory.subCategories || activeCategory.subCategories.length === 0) {
        return null;
    }

    const handleSubCategoryClick = (subSlug: string | null) => {
        const params = new URLSearchParams(searchParams.toString());

        if (subSlug) {
            params.set('subCategory', subSlug);
        } else {
            params.delete('subCategory');
        }

        // Reset to page 1 if pagination exists
        // params.delete('page'); 

        router.push(`/products?${params.toString()}`);
    };

    return (
        <div className="category-pills-container">
            <div className="category-pills-scroll">
                {/* "All [Category]" Pill */}
                <button
                    className={`category-pill ${!currentSubCategory ? 'active' : ''}`}
                    onClick={() => handleSubCategoryClick(null)}
                >
                    All {activeCategory.name}
                </button>

                {/* Subcategory Pills */}
                {activeCategory.subCategories.map((sub) => (
                    <button
                        key={sub.id}
                        className={`category-pill ${currentSubCategory === sub.slug ? 'active' : ''}`}
                        onClick={() => handleSubCategoryClick(sub.slug)}
                    >
                        {sub.name}
                    </button>
                ))}
            </div>
        </div>
    );
};
