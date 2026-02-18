const CART_KEY = "swiftcart_cart";

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to read cart:", error);
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
  renderCartSummary();
  document.dispatchEvent(new CustomEvent("cart:updated", { detail: cart }));
}

function addToCart(product) {
  if (!product || !product.id) return;

  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: Number(product.price) || 0,
      image: product.image || "",
      quantity: 1,
    });
  }

  saveCart(cart);
}

function removeFromCart(productId) {
  const id = Number(productId);
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
}

function increaseQuantity(productId) {
  const id = Number(productId);
  const cart = getCart();
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;
  item.quantity += 1;
  saveCart(cart);
}

function decreaseQuantity(productId) {
  const id = Number(productId);
  const cart = getCart();
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;

  if (item.quantity <= 1) {
    removeFromCart(id);
    return;
  }

  item.quantity -= 1;
  saveCart(cart);
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function updateCartCount() {
  const count = getCartCount();
  document.querySelectorAll("#cart-count").forEach((badge) => {
    badge.textContent = count;
  });
}

function renderCartSummary() {
  const listEl = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const emptyEl = document.getElementById("cart-empty");

  if (!listEl || !totalEl || !emptyEl) return;

  const cart = getCart();
  listEl.innerHTML = "";

  if (cart.length === 0) {
    emptyEl.classList.remove("hidden");
  } else {
    emptyEl.classList.add("hidden");
  }

  cart.forEach((item) => {
    const row = document.createElement("div");
    row.className = "flex items-center justify-between border-b py-3";
    row.innerHTML = `
      <div class="flex items-center gap-3 min-w-0">
        <img src="${item.image}" alt="${item.title}" class="h-12 w-12 object-contain bg-gray-100 rounded" />
        <div class="min-w-0">
          <p class="font-medium truncate">${item.title}</p>
          <p class="text-sm text-gray-500">$${item.price.toFixed(2)} x ${item.quantity}</p>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <button class="qty-dec h-8 w-8 rounded border border-gray-300 hover:bg-gray-100" data-id="${item.id}" aria-label="Decrease quantity">-</button>
          <span class="font-semibold w-6 text-center">${item.quantity}</span>
          <button class="qty-inc h-8 w-8 rounded border border-gray-300 hover:bg-gray-100" data-id="${item.id}" aria-label="Increase quantity">+</button>
        </div>
        <p class="font-semibold">$${(item.price * item.quantity).toFixed(2)}</p>
        <button class="remove-cart-item text-red-600 hover:text-red-700" data-id="${item.id}">
          Remove
        </button>
      </div>
    `;
    listEl.appendChild(row);
  });

  totalEl.textContent = `$${getCartTotal().toFixed(2)}`;
}

document.addEventListener("click", (e) => {
  const removeBtn = e.target.closest(".remove-cart-item");
  if (removeBtn) {
    removeFromCart(removeBtn.getAttribute("data-id"));
    return;
  }

  const incBtn = e.target.closest(".qty-inc");
  if (incBtn) {
    increaseQuantity(incBtn.getAttribute("data-id"));
    return;
  }

  const decBtn = e.target.closest(".qty-dec");
  if (decBtn) {
    decreaseQuantity(decBtn.getAttribute("data-id"));
  }
});

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCartSummary();
});

window.CartAPI = {
  getCart,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  getCartCount,
  getCartTotal,
  updateCartCount,
  renderCartSummary,
};
