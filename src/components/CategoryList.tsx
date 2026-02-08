import { useEffect, useState } from 'react';
import { fetchCategories } from '../api/categories';

type Category = {
  id: number;
  name: string;
};

export function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then(data => setCategories(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {categories.map(cat => (
        <li key={cat.id}>{cat.name}</li>
      ))}
    </ul>
  );
}
