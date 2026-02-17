const productContainer = document.getElementById("product-container");
const loading = document.getElementById("loading");

// Show loading
function showLoading() {
  loading.classList.remove("hidden");
}

// Hide loading
function hideLoading() {
  loading.classList.add("hidden");
}

// Fetch All Products
async function fetchProducts() {
  try {
    showLoading();

    const res = await fetch("https://fakestoreapi.com/products");
    const data = await res.json();

    displayProducts(data);

    hideLoading();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Display Products
function displayProducts(products) {
  productContainer.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-xl shadow hover:shadow-lg transition p-4";

    card.innerHTML = `
      <img src="${product.image}"
           class="h-52 mx-auto object-contain mb-4" />

      <span class="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded">
        ${product.category}
      </span>

      <h3 class="font-semibold mt-3 truncate">
        ${product.title}
      </h3>

      <div class="flex justify-between items-center mt-2">
        <span class="font-bold">$${product.price}</span>
        <span class="text-yellow-500 text-sm">
          ★ ${product.rating.rate}
        </span>
      </div>

      <div class="flex gap-2 mt-4">
        <button class="flex-1 border border-gray-300 py-2 rounded hover:bg-gray-200">
          Details
        </button>
        <button class="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
          Add
        </button>
      </div>
    `;

    productContainer.appendChild(card);
  });
}

// Load products on page load
fetchProducts();
