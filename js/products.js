const modal = document.getElementById("product-modal");
const modalContent = document.getElementById("modal-content");
const closeModalBtn = document.getElementById("close-modal");
const productContainer = document.getElementById("product-container");
const categoryContainer = document.getElementById("category-container");
const loading = document.getElementById("loading");

const BASE_URL = "https://fakestoreapi.com/products";
const productCache = new Map();

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed (${res.status}): ${url}`);
  return res.json();
}

function showLoading() {
  loading.classList.remove("hidden");
}

function hideLoading() {
  loading.classList.add("hidden");
}

async function fetchAllProducts() {
  try {
    showLoading();
    const data = await fetchJson(BASE_URL);
    displayProducts(data);
  } catch (error) {
    console.error(error);
  } finally {
    hideLoading();
  }
}

async function fetchByCategory(category) {
  try {
    showLoading();
    const encodedCategory = encodeURIComponent(category);
    const data = await fetchJson(`${BASE_URL}/category/${encodedCategory}`);
    displayProducts(data);
  } catch (error) {
    console.error(error);
  } finally {
    hideLoading();
  }
}

function displayProducts(products) {
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
    const product = await fetchJson(`${BASE_URL}/${id}`);
    showModal(product);
  } catch (error) {
    console.error(error);
  } finally {
    hideLoading();
  }
}

function showModal(product) {
  productCache.set(Number(product.id), product);

  modalContent.innerHTML = `
    <img src="${product.image}" class="h-60 mx-auto object-contain mb-4" />
    <h2 class="text-xl font-bold mb-2">${product.title}</h2>
    <p class="text-gray-600 mb-4 text-sm">${product.description}</p>
    <div class="flex justify-between items-center mb-4">
      <span class="text-lg font-bold">$${product.price}</span>
      <span class="text-yellow-500">&#9733; ${product.rating?.rate ?? "N/A"}</span>
    </div>
    <button id="modal-add-to-cart" data-id="${product.id}" class="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
      Add to Cart
    </button>
  `;
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

closeModalBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
});

modal.addEventListener("click", (e) => {
  if (e.target !== modal) return;
  modal.classList.add("hidden");
  modal.classList.remove("flex");
});

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
    const categories = await fetchJson(`${BASE_URL}/categories`);
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
