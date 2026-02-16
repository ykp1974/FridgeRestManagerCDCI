export async function fetchCategories() {
    // URLに ?type=ingredients を付与して、doGet側で分岐させる
  const fetchUrl = `${import.meta.env.VITE_GAS_API_URL}?type=category`;
  const res = await fetch(fetchUrl, {
    method: 'GET',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }

  return res.json();
}
