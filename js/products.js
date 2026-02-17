const productContainer = document.getElementById("product-container");
const categoryContainer = document.getElementById("category-container");
const loading = document.getElementById("loading");

const BASE_URL = "https://fakestoreapi.com/products";

// ================= LOADING =================
function showLoading() {
  loading.classList.remove("hidden");
}

function hideLoading() {
  loading.classList.add("hidden");
}

// ================= FETCH ALL PRODUCTS =================
async function fetchAllProducts() {
  try {
    showLoading();

    const res = await fetch(BASE_URL);
    const data = await res.json();

    displayProducts(data);
    hideLoading();

  } catch (error) {
    console.error(error);
  }
}

// ================= FETCH BY CATEGORY =================
async function fetchByCategory(category) {
  try {
    showLoading();

    const res = await fetch(`${BASE_URL}/category/${category}`);
    const data = await res.json();

    displayProducts(data);
    hideLoading();

  } catch (error) {
    console.error(error);
  }
}

// ================= DISPLAY PRODUCTS =================
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

// ================= LOAD CATEGORIES =================
async function loadCategories() {
  try {
    const res = await fetch(`${BASE_URL}/categories`);
    const categories = await res.json();

    // Add "All" button first
    createCategoryButton("All", true);

    categories.forEach(category => {
      createCategoryButton(category);
    });

  } catch (error) {
    console.error(error);
  }
}

// ================= CREATE CATEGORY BUTTON =================
function createCategoryButton(category, isActive = false) {
  const button = document.createElement("button");

  button.textContent = category;

  button.className = `
    px-4 py-2 rounded-full border 
    ${isActive ? 
      "bg-indigo-600 text-white border-indigo-600" : 
      "bg-white text-gray-700 border-gray-300 hover:bg-indigo-50"}
  `;

  button.addEventListener("click", () => {

    // Remove active from all buttons
    document.querySelectorAll("#category-container button")
      .forEach(btn => {
        btn.classList.remove("bg-indigo-600", "text-white", "border-indigo-600");
        btn.classList.add("bg-white", "text-gray-700", "border-gray-300");
      });

    // Add active to clicked
    button.classList.remove("bg-white", "text-gray-700", "border-gray-300");
    button.classList.add("bg-indigo-600", "text-white", "border-indigo-600");

    // Fetch products
    if (category === "All") {
      fetchAllProducts();
    } else {
      fetchByCategory(category);
    }
  });

  categoryContainer.appendChild(button);
}

// ================= INIT =================
loadCategories();
fetchAllProducts();
