export async function fetchCategories() {
  const res = await fetch(import.meta.env.VITE_GAS_API_URL);

  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }

  return res.json();
}
