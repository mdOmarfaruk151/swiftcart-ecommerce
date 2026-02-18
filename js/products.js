const modal = document.getElementById("product-modal");
const modalContent = document.getElementById("modal-content");
const closeModalBtn = document.getElementById("close-modal");
const productContainer = document.getElementById("product-container");
const categoryContainer = document.getElementById("category-container");
const loading = document.getElementById("loading");

const BASE_URL = "https://fakestoreapi.com/products";
const productCache = new Map();
const apiService = window.APIService;
const modalService = window.ModalService;
const PRODUCT_CACHE_KEY = "swiftcart_products_cache";

async function fetchJsonFallback(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed (${res.status}): ${url}`);
  }
  return res.json();
}

function showLoading() {
  loading.classList.remove("hidden");
}

function hideLoading() {
  loading.classList.add("hidden");
}

function showProductMessage(message) {
  productContainer.innerHTML = `
    <div class="col-span-full text-center text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
      ${message}
    </div>
  `;
}

function saveProductsCache(products) {
  localStorage.setItem(PRODUCT_CACHE_KEY, JSON.stringify(products));
}

function getProductsCache() {
  try {
    const raw = localStorage.getItem(PRODUCT_CACHE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to read product cache:", error);
    return [];
  }
}

async function fetchAllProducts() {
  try {
    showLoading();
    const data = apiService
      ? await apiService.getAllProducts()
      : await fetchJsonFallback(BASE_URL);
    if (!Array.isArray(data)) throw new Error("Invalid products response");
    saveProductsCache(data);
    displayProducts(data);
  } catch (error) {
    console.error(error);
    const cached = getProductsCache();
    if (cached.length > 0) {
      displayProducts(cached);
    } else {
      showProductMessage("Failed to load products. Please check your internet and refresh.");
    }
  } finally {
    hideLoading();
  }
}

async function fetchByCategory(category) {
  try {
    showLoading();
    const data = apiService
      ? await apiService.getProductsByCategory(category)
      : await fetchJsonFallback(`${BASE_URL}/category/${encodeURIComponent(category)}`);
    if (!Array.isArray(data)) throw new Error("Invalid category response");
    displayProducts(data);
  } catch (error) {
    console.error(error);
    showProductMessage("Failed to load this category. Try again.");
  } finally {
    hideLoading();
  }
}

function displayProducts(products) {
  if (!Array.isArray(products) || products.length === 0) {
    showProductMessage("No products found.");
    return;
  }
  productContainer.innerHTML = "";

  products.forEach((product) => {
    productCache.set(Number(product.id), product);

    const card = document.createElement("div");
    card.className = "bg-white rounded-xl shadow hover:shadow-lg transition p-4";
    card.innerHTML = `
      <img src="${product.image}" class="h-52 mx-auto object-contain mb-4" />
      <span class="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded">${product.category}</span>
      <h3 class="font-semibold mt-3 truncate">${product.title}</h3>
      <div class="flex justify-between items-center mt-2">
        <span class="font-bold">$${product.price}</span>
        <span class="text-yellow-500 text-sm">&#9733; ${product.rating?.rate ?? "N/A"}</span>
      </div>
      <div class="flex gap-2 mt-4">
        <button class="details-btn flex-1 border border-gray-300 py-2 rounded hover:bg-gray-200" data-id="${product.id}">
          Details
        </button>
        <button class="add-cart-btn flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700" data-id="${product.id}">
          Add
        </button>
      </div>
    `;
    productContainer.appendChild(card);
  });
}

productContainer.addEventListener("click", (e) => {
  const detailsBtn = e.target.closest(".details-btn");
  if (detailsBtn) {
    const id = detailsBtn.getAttribute("data-id");
    if (id) fetchSingleProduct(id);
    return;
  }

  const addBtn = e.target.closest(".add-cart-btn");
  if (!addBtn) return;

  const id = Number(addBtn.getAttribute("data-id"));
  const product = productCache.get(id);
  if (product && window.CartAPI) {
    window.CartAPI.addToCart(product);
  }
});

async function fetchSingleProduct(id) {
  try {
    showLoading();
    const product = apiService
      ? await apiService.getProductById(id)
      : await fetchJsonFallback(`${BASE_URL}/${id}`);
    showModal(product);
  } catch (error) {
    console.error(error);
  } finally {
    hideLoading();
  }
}

function showModal(product) {
  if (!product) return;
  productCache.set(Number(product.id), product);

  if (modalService) {
    modalService.renderProductDetails(modalContent, product, "modal-add-to-cart");
    modalService.open(modal);
  }
}

if (modalService) {
  modalService.bindClose({ modalEl: modal, closeBtnEl: closeModalBtn });
}

modalContent.addEventListener("click", (e) => {
  const addBtn = e.target.closest("#modal-add-to-cart");
  if (!addBtn) return;

  const id = Number(addBtn.getAttribute("data-id"));
  const product = productCache.get(id);

  if (product && window.CartAPI) {
    window.CartAPI.addToCart(product);
  }
});

async function loadCategories() {
  try {
    const categories = apiService
      ? await apiService.getCategories()
      : await fetchJsonFallback(`${BASE_URL}/categories`);
    createCategoryButton("All", true);
    categories.forEach((category) => createCategoryButton(category));
  } catch (error) {
    console.error(error);
  }
}

function createCategoryButton(category, isActive = false) {
  const button = document.createElement("button");
  button.textContent = category;
  button.className = `
    px-4 py-2 rounded-full border
    ${isActive ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-700 border-gray-300 hover:bg-indigo-50"}
  `;

  button.addEventListener("click", () => {
    document.querySelectorAll("#category-container button").forEach((btn) => {
      btn.classList.remove("bg-indigo-600", "text-white", "border-indigo-600");
      btn.classList.add("bg-white", "text-gray-700", "border-gray-300");
    });

    button.classList.remove("bg-white", "text-gray-700", "border-gray-300");
    button.classList.add("bg-indigo-600", "text-white", "border-indigo-600");

    if (category === "All") fetchAllProducts();
    else fetchByCategory(category);
  });

  categoryContainer.appendChild(button);
}

loadCategories();
fetchAllProducts();
