import { useEffect } from 'react';
import { fetchCategories } from '../api/categories';
import { FetchedCategory } from '../types/Ingredient'; // Import FetchedCategory

interface CategoryListProps {
  onCategoriesFetched: (categories: FetchedCategory[]) => void;
}

export function CategoryList({ onCategoriesFetched }: CategoryListProps) {
  useEffect(() => {
    fetchCategories()
      .then(data => {
        onCategoriesFetched(data); // Pass fetched categories to the callback
      })
      .catch(error => {
        console.error("Failed to fetch categories:", error);
        // Optionally handle error by passing an empty array or specific error state
        onCategoriesFetched([]);
      });
  }, [onCategoriesFetched]); // Dependency array includes onCategoriesFetched

  return null; // This component no longer renders anything visible
}
