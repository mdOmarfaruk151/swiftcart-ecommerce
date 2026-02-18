(() => {
  function open(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove("hidden");
    modalEl.classList.add("flex");
  }

  function close(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add("hidden");
    modalEl.classList.remove("flex");
  }

  function bindClose({ modalEl, closeBtnEl }) {
    if (!modalEl) return;

    if (closeBtnEl) {
      closeBtnEl.addEventListener("click", () => close(modalEl));
    }

    modalEl.addEventListener("click", (e) => {
      if (e.target !== modalEl) return;
      close(modalEl);
    });
  }

  function renderProductDetails(contentEl, product, buttonId = "modal-add-to-cart") {
    if (!contentEl || !product) return;

    contentEl.innerHTML = `
      <img src="${product.image}" class="h-60 mx-auto object-contain mb-4" />
      <h2 class="text-xl font-bold mb-2">${product.title}</h2>
      <p class="text-gray-600 mb-4 text-sm">${product.description}</p>
      <div class="flex justify-between items-center mb-4">
        <span class="text-lg font-bold">$${product.price}</span>
        <span class="text-yellow-500">&#9733; ${product.rating?.rate ?? "N/A"}</span>
      </div>
      <button id="${buttonId}"
        class="add-cart-btn w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        data-id="${product.id}"
        data-title="${String(product.title).replace(/"/g, "&quot;")}"
        data-price="${product.price}"
        data-image="${product.image}">
        Add to Cart
      </button>
    `;
  }

  window.ModalService = {
    open,
    close,
    bindClose,
    renderProductDetails,
  };
})();
