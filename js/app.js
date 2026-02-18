// Mobile Menu Toggle
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const closeCartModalBtn = document.getElementById("close-cart-modal");
const trendingContainer = document.getElementById("trending-container");
const trendingLoading = document.getElementById("trending-loading");
const homeProductModal = document.getElementById("home-product-modal");
const homeCloseModalBtn = document.getElementById("home-close-modal");
const homeModalContent = document.getElementById("home-modal-content");
const trendingCache = new Map();
const API = window.APIService;
const Modal = window.ModalService;

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}

if (cartBtn) {
  cartBtn.addEventListener("click", () => {
    if (cartModal) {
      if (Modal) Modal.open(cartModal);
      return;
    }

    window.location.href = "products.html#open-cart";
  });
}

if (Modal) {
  Modal.bindClose({ modalEl: cartModal, closeBtnEl: closeCartModalBtn });
}

if (cartModal && window.location.hash === "#open-cart") {
  if (Modal) Modal.open(cartModal);
}

async function fetchHomeTrendingProducts() {
  if (!trendingContainer) return;

  try {
    if (trendingLoading) trendingLoading.classList.remove("hidden");

    const products = API
      ? await API.getTrendingProducts(3)
      : await (await fetch("https://fakestoreapi.com/products?limit=3")).json();
    renderTrendingProducts(products);
  } catch (error) {
    console.error(error);
    trendingContainer.innerHTML = `
      <div class="col-span-full text-center text-red-600">
        Failed to load trending products.
      </div>
    `;
  } finally {
    if (trendingLoading) trendingLoading.classList.add("hidden");
  }
}

function renderTrendingProducts(products) {
  if (!trendingContainer) return;

  trendingContainer.innerHTML = "";

  products.forEach((product) => {
    trendingCache.set(Number(product.id), product);

    const card = document.createElement("div");
    card.className = "bg-gray-100 rounded-xl shadow p-4";
    card.innerHTML = `
      <img src="${product.image}"
           alt="${product.title}"
           onerror="this.onerror=null;this.src='assets/images/banner-image.png';"
           class="h-60 mx-auto object-contain mb-4" />
      <span class="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded">
        ${product.category}
      </span>
      <h3 class="font-semibold mt-3 truncate">${product.title}</h3>
      <div class="flex justify-between items-center mt-2">
        <span class="font-bold">$${product.price}</span>
        <span class="text-yellow-500 text-sm">&#9733; ${product.rating?.rate ?? "N/A"}</span>
      </div>
      <div class="flex gap-2 mt-4">
        <button class="trending-details-btn flex-1 border border-gray-300 py-2 rounded hover:bg-gray-200 text-center" data-id="${product.id}">
          Details
        </button>
        <button class="add-cart-btn flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          data-id="${product.id}"
          data-title="${String(product.title).replace(/"/g, "&quot;")}"
          data-price="${product.price}"
          data-image="${product.image}">
          Add
        </button>
      </div>
    `;

    trendingContainer.appendChild(card);
  });
}

function openHomeProductModal(product) {
  if (!homeProductModal || !homeModalContent || !product) return;

  if (Modal) {
    Modal.renderProductDetails(homeModalContent, product, "home-modal-add-to-cart");
    Modal.open(homeProductModal);
    return;
  }
}

document.addEventListener("click", (e) => {
  const detailsBtn = e.target.closest(".trending-details-btn");
  if (detailsBtn) {
    const id = Number(detailsBtn.getAttribute("data-id"));
    const product = trendingCache.get(id);
    openHomeProductModal(product);
    return;
  }

  const addBtn = e.target.closest(".add-cart-btn");
  if (!addBtn || !window.CartAPI) return;

  if (addBtn.hasAttribute("data-id") && addBtn.hasAttribute("data-title")) {
    const product = {
      id: Number(addBtn.getAttribute("data-id")),
      title: addBtn.getAttribute("data-title"),
      price: Number(addBtn.getAttribute("data-price")),
      image: addBtn.getAttribute("data-image") || "",
    };
    window.CartAPI.addToCart(product);
  }
});

if (Modal) {
  Modal.bindClose({ modalEl: homeProductModal, closeBtnEl: homeCloseModalBtn });
}

fetchHomeTrendingProducts();

