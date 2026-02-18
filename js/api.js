(() => {
  const BASE_URL = "https://fakestoreapi.com/products";

  async function fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Request failed (${res.status}): ${url}`);
    }
    return res.json();
  }

  async function getAllProducts() {
    return fetchJson(BASE_URL);
  }

  async function getProductsByCategory(category) {
    const encodedCategory = encodeURIComponent(category);
    return fetchJson(`${BASE_URL}/category/${encodedCategory}`);
  }

  async function getCategories() {
    return fetchJson(`${BASE_URL}/categories`);
  }

  async function getProductById(id) {
    return fetchJson(`${BASE_URL}/${id}`);
  }

  async function getTrendingProducts(limit = 3) {
    return fetchJson(`${BASE_URL}?limit=${limit}`);
  }

  window.APIService = {
    BASE_URL,
    fetchJson,
    getAllProducts,
    getProductsByCategory,
    getCategories,
    getProductById,
    getTrendingProducts,
  };
})();
